#!/usr/bin/env node

/**
 * Automated monitoring cron job
 *
 * This script should be run periodically (every 5-15 minutes) to check system health
 * and send alerts when issues are detected.
 *
 * Setup:
 * 1. Add to crontab: `*/5 * * * * /path/to/node /path/to/scripts/cron-monitoring.js`
 * 2. Or use a service like GitHub Actions, Vercel Cron, or AWS EventBridge
 *
 * Environment variables needed:
 * - MONITORING_API_URL: The URL to your monitoring API endpoint
 * - ADMIN_API_KEY: Authentication key for admin API access
 * - ALERT_WEBHOOK_URL: Webhook URL for sending alerts (Slack, Discord, etc.)
 * - EMAIL_SERVICE_API_KEY: For sending email alerts
 */

const https = require('https')
const http = require('http')

// Configuration
const config = {
  monitoringApiUrl: process.env.MONITORING_API_URL || 'http://localhost:3000/api/admin/monitoring',
  adminApiKey: process.env.ADMIN_API_KEY || '',
  alertWebhookUrl: process.env.ALERT_WEBHOOK_URL || '',
  emailServiceApiKey: process.env.EMAIL_SERVICE_API_KEY || '',

  // Thresholds
  maxResponseTime: 5000, // 5 seconds
  criticalAlertTypes: ['HIGH_ERROR_RATE', 'SYSTEM_OVERLOAD', 'DATABASE_ISSUES'],
}

async function runHealthCheck() {
  try {
    console.log(`🔍 Starting health check at ${new Date().toISOString()}`)

    // Trigger health check
    const healthCheckResponse = await makeRequest(
      `${config.monitoringApiUrl}?action=health-check`,
      'GET'
    )

    const { alerts, timestamp } = healthCheckResponse

    if (alerts && alerts.length > 0) {
      console.log(`⚠️  Found ${alerts.length} alerts:`)

      for (const alert of alerts) {
        console.log(`  - [${alert.severity}] ${alert.title}: ${alert.message}`)

        // Send notifications for critical alerts
        if (config.criticalAlertTypes.includes(alert.type) || alert.severity === 'CRITICAL') {
          await sendAlertNotification(alert)
        }
      }
    } else {
      console.log('✅ System health check passed - no alerts')
    }

    // Get current metrics for logging
    const metricsResponse = await makeRequest(
      `${config.monitoringApiUrl}?action=metrics`,
      'GET'
    )

    const { metrics } = metricsResponse
    console.log(`📊 Current metrics:`)
    console.log(`  - Error rate: ${metrics.errorRate}%`)
    console.log(`  - Response time: ${metrics.responseTime}ms`)
    console.log(`  - Active users: ${metrics.activeUsers}`)
    console.log(`  - System load: ${metrics.systemLoad}%`)

  } catch (error) {
    console.error('❌ Health check failed:', error.message)

    // Send critical alert about monitoring failure
    await sendAlertNotification({
      type: 'SYSTEM_OVERLOAD',
      severity: 'CRITICAL',
      title: 'Monitoring System Failure',
      message: `Health check script failed: ${error.message}`,
      createdAt: new Date().toISOString()
    })
  }
}

async function sendAlertNotification(alert) {
  const notifications = []

  // Send Slack notification
  if (config.alertWebhookUrl) {
    notifications.push(sendSlackAlert(alert))
  }

  // Send email notification
  if (config.emailServiceApiKey) {
    notifications.push(sendEmailAlert(alert))
  }

  // Send Discord notification (if configured)
  // notifications.push(sendDiscordAlert(alert))

  await Promise.allSettled(notifications)
}

async function sendSlackAlert(alert) {
  try {
    const color = {
      'LOW': '#36a64f',      // Green
      'MEDIUM': '#ff9500',   // Orange
      'HIGH': '#ff0000',     // Red
      'CRITICAL': '#8b0000'  // Dark red
    }[alert.severity] || '#cccccc'

    const payload = {
      text: `🚨 System Alert: ${alert.title}`,
      attachments: [
        {
          color: color,
          fields: [
            {
              title: 'Severity',
              value: alert.severity,
              short: true
            },
            {
              title: 'Type',
              value: alert.type.replace(/_/g, ' '),
              short: true
            },
            {
              title: 'Message',
              value: alert.message,
              short: false
            },
            {
              title: 'Time',
              value: new Date(alert.createdAt || new Date()).toLocaleString(),
              short: true
            }
          ],
          footer: 'SellerFi Monitoring',
          ts: Math.floor(new Date(alert.createdAt || new Date()).getTime() / 1000)
        }
      ]
    }

    await makeRequest(config.alertWebhookUrl, 'POST', payload)
    console.log('✅ Slack alert sent')
  } catch (error) {
    console.error('❌ Failed to send Slack alert:', error.message)
  }
}

async function sendEmailAlert(alert) {
  try {
    // Example using SendGrid, Mailgun, or similar service
    const emailPayload = {
      to: 'admin@sellerfi.com',
      subject: `🚨 SellerFi Alert: ${alert.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #dc3545; margin: 0;">🚨 System Alert</h1>
          </div>

          <div style="padding: 20px; background: white; border: 1px solid #dee2e6; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">${alert.title}</h2>
            <p style="font-size: 16px; color: #666;">${alert.message}</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Severity:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: ${alert.severity === 'CRITICAL' ? '#dc3545' : '#ff6b35'};">
                  ${alert.severity}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Type:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${alert.type.replace(/_/g, ' ')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Time:</strong></td>
                <td style="padding: 8px 0;">${new Date(alert.createdAt || new Date()).toLocaleString()}</td>
              </tr>
            </table>

            ${alert.metadata ? `
              <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 4px;">
                <strong>Additional Details:</strong>
                <pre style="white-space: pre-wrap; font-size: 12px; color: #666;">${JSON.stringify(alert.metadata, null, 2)}</pre>
              </div>
            ` : ''}
          </div>

          <div style="margin-top: 20px; padding: 15px; text-align: center; color: #666; font-size: 12px;">
            SellerFi Automated Monitoring System
          </div>
        </div>
      `
    }

    // Replace with actual email service API call
    // await emailService.send(emailPayload)

    console.log('✅ Email alert would be sent (email service not configured)')
  } catch (error) {
    console.error('❌ Failed to send email alert:', error.message)
  }
}

function makeRequest(url, method, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SellerFi-Monitoring-Bot/1.0'
      },
      timeout: config.maxResponseTime
    }

    if (config.adminApiKey) {
      options.headers['Authorization'] = `Bearer ${config.adminApiKey}`
    }

    const client = urlObj.protocol === 'https:' ? https : http
    const req = client.request(options, (res) => {
      let body = ''

      res.on('data', (chunk) => {
        body += chunk
      })

      res.on('end', () => {
        try {
          const parsedBody = JSON.parse(body)
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedBody)
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsedBody.error || body}`))
          }
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${body}`))
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.on('timeout', () => {
      req.abort()
      reject(new Error('Request timeout'))
    })

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data))
    }

    req.end()
  })
}

// Run the health check
if (require.main === module) {
  runHealthCheck()
    .then(() => {
      console.log('✅ Health check completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Health check failed:', error)
      process.exit(1)
    })
}

module.exports = { runHealthCheck }