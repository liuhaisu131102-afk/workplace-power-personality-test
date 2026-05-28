// 职场权力人格测评 - 数据统计模块
// 匿名数据收集，用户行为分析

class Analytics {
  constructor() {
    this.userId = this.getUserId();
    this.startTime = Date.now();
    this.events = [];
    this.enabled = true; // 可关闭
  }

  getUserId() {
    let userId = localStorage.getItem('wpr_user_id');
    if (!userId) {
      userId = 'u_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      localStorage.setItem('wpr_user_id', userId);
    }
    return userId;
  }

  track(event, data = {}) {
    if (!this.enabled) return;
    
    const eventData = {
      userId: this.userId,
      event,
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      ...data
    };

    this.events.push(eventData);
    
    // 批量发送（每5条或15秒）
    if (this.events.length >= 5) {
      this.flush();
    }

    // 离开时发送
    if (!this._boundUnload) {
      this._boundUnload = true;
      window.addEventListener('beforeunload', () => this.flush());
    }
  }

  trackPageView(page) {
    this.track('page_view', { page });
  }

  trackAssessmentStart() {
    this.startTime = Date.now(); // 重置开始时间
    this.track('assessment_start');
  }

  trackAssessmentComplete(resultType, scores, duration) {
    this.track('assessment_complete', {
      resultType,
      scores,
      duration,
      questionCount: 30
    });
  }

  trackShare(platform) {
    this.track('share', { platform });
  }

  trackImageSave() {
    this.track('image_save');
  }

  trackLinkCopy() {
    this.track('link_copy');
  }

  async flush() {
    if (this.events.length === 0) return;
    
    const events = [...this.events];
    this.events = [];

    try {
      // 本地存储备份
      const stored = JSON.parse(localStorage.getItem('wpr_analytics') || '[]');
      stored.push(...events);
      // 只保留最近1000条
      if (stored.length > 1000) {
        stored.splice(0, stored.length - 1000);
      }
      localStorage.setItem('wpr_analytics', JSON.stringify(stored));

      // 发送到服务器（如果有）
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ events })
      // });
    } catch (e) {
      console.warn('Analytics error:', e);
    }
  }

  // 获取统计数据（管理后台使用）
  getLocalStats() {
    const events = JSON.parse(localStorage.getItem('wpr_analytics') || '[]');
    
    const stats = {
      totalUsers: new Set(events.map(e => e.userId)).size,
      totalCompletions: events.filter(e => e.event === 'assessment_complete').length,
      totalShares: events.filter(e => e.event === 'share').length,
      resultDistribution: {},
      averageDuration: 0
    };

    // 结果分布
    events
      .filter(e => e.event === 'assessment_complete')
      .forEach(e => {
        stats.resultDistribution[e.resultType] = (stats.resultDistribution[e.resultType] || 0) + 1;
      });

    // 平均完成时间
    const completions = events.filter(e => e.event === 'assessment_complete');
    if (completions.length > 0) {
      stats.averageDuration = completions.reduce((sum, e) => sum + e.duration, 0) / completions.length;
    }

    return stats;
  }

  // 清除数据（用户隐私）
  clearData() {
    localStorage.removeItem('wpr_analytics');
    localStorage.removeItem('wpr_user_id');
    localStorage.removeItem('wpr_cache');
    this.events = [];
  }
}

// 全局实例
window.analytics = new Analytics();

// 使用示例：
// analytics.trackPageView('home');
// analytics.trackAssessmentComplete('Dominant', {...}, 120000);
// analytics.trackShare('wechat');
// analytics.trackImageSave();