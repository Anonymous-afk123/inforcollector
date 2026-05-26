// ========================================
// 网页端微信登录改造示例代码
// ========================================

/**
 * 前端：添加微信登录按钮和授权逻辑
 */
class WechatLogin {
  constructor() {
    this.appId = '你的微信AppID'; // 替换为你的公众号 AppID
    this.redirectUri = encodeURIComponent(window.location.origin + '/callback');
  }

  // 1. 发起微信网页授权
  startAuth() {
    const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appId}&redirect_uri=${this.redirectUri}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
    window.location.href = authUrl;
  }

  // 2. 处理回调，获取 code
  handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      this.loginWithCode(code);
    }
  }

  // 3. 用 code 换取 openid 和用户信息
  async loginWithCode(code) {
    try {
      const response = await fetch(`https://你的后端域名/api/wechat/web-login?code=${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      console.log('登录结果：', result);

      if (result.code === 200) {
        // 保存用户信息到 localStorage
        localStorage.setItem('openid', result.data.openid);
        localStorage.setItem('userInfo', JSON.stringify(result.data.user));

        // 刷新页面或跳转到主页
        this.loadUserData(result.data.openid);
      }
    } catch (error) {
      console.error('登录失败：', error);
    }
  }

  // 4. 加载用户在小程序填写的采集表数据
  async loadUserData(openid) {
    try {
      const response = await fetch(`https://你的后端域名/api/software-copyright/forms/user/${openid}`);
      const result = await response.json();

      if (result.code === 200) {
        console.log('用户的采集表数据：', result.data);
        this.renderForms(result.data);
      } else {
        console.log('该用户暂无数据，请先在小程序填写采集表');
      }
    } catch (error) {
      console.error('查询数据失败：', error);
    }
  }

  // 5. 渲染采集表列表
  renderForms(forms) {
    const container = document.getElementById('forms-container');
    if (!container) return;

    if (forms.length === 0) {
      container.innerHTML = '<p>暂无数据，请先在小程序填写采集表</p>';
      return;
    }

    container.innerHTML = forms.map(form => `
      <div class="form-card">
        <h3>${form.software_full_name}</h3>
        <p>版本：${form.version}</p>
        <p>创建时间：${new Date(form.created_at).toLocaleString()}</p>
        <button onclick="generateDocument('${form.id}')">生成文档</button>
      </div>
    `).join('');
  }
}

// 使用示例
const wechatLogin = new WechatLogin();

// 页面加载时检查是否需要处理回调
window.addEventListener('DOMContentLoaded', () => {
  const code = new URLSearchParams(window.location.search).get('code');
  if (code) {
    wechatLogin.loginWithCode(code);
  }
});
