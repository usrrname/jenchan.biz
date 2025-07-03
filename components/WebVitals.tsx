'use client'

import { useReportWebVitals } from 'next/web-vitals'
type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0]

const logWebVitals: ReportWebVitalsCallback = (metric) => {
  const body = JSON.stringify(metric)
  const url = `https://www.google-analytics.com/collect?v=2&t=event&tid=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}&cid=555&en=page_view&ds=web&dp=/${window.location.pathname}&dt=${window.document.title}&uip=${window.location.hostname}`

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
  switch (metric.name) {
    case 'CLS':
      console.info('CLS', metric.value)
      break
    case 'FCP':
      console.info('FCP', metric.value)
      break
    case 'LCP':
      console.info('LCP', metric.value)
      break
    case 'TTFB':
      console.info('TTFB', metric.value)
      break
    case 'INP':
      console.info('INP', metric.value)
      break
  }
}

export default function WebVitals() {
  useReportWebVitals(logWebVitals)
  return null
}
