module.exports = {
  alert: {
    exchange: {
      exchange: 'alerts',
      type: 'topic',
      auto_delete: false,
      durable: true,
    },
    queue_critical: {
      queue: 'critical',
      auto_delete: false,
      exchange: 'alerts',
      routing_key: 'critical.*',
    },
    queue_rate_limit: {
      queue: 'rate_limit',
      auto_delete: false,
      exchange: 'alerts',
      routing_key: '*.rate_limit'
    }
  }
}