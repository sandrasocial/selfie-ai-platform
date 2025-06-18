// /lib/email/templates/selfie-score-result.ts
// Email template for selfie score results

export interface ScoreEmailData {
  userEmail: string;
  userName: string;
  overall_score: number;
  sub_scores: {
    lighting: number;
    composition: number;
    expression: number;
    background: number;
    styling: number;
  };
  recommendations: string[];
  badge: string;
  share_id: string;
  share_url: string;
  share_text: string;
  image_url: string;
  isProUser: boolean;
}

export function generateScoreEmailHTML(data: ScoreEmailData): string {
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Legend': return '#fbbf24';
      case 'Icon': return '#a855f7';
      case 'Rising Star': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#059669';
    if (score >= 60) return '#d97706';
    return '#dc2626';
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Selfie Score: ${data.overall_score}/100</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #171719;
          background-color: #F1F1F1;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background-color: #171719;
          color: #ffffff;
          padding: 40px 30px;
          text-align: center;
        }
        .logo {
          font-family: 'Bodoni Moda', serif;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .content {
          padding: 40px 30px;
        }
        .score-display {
          text-align: center;
          margin-bottom: 40px;
        }
        .main-score {
          font-family: 'Bodoni Moda', serif;
          font-size: 72px;
          font-weight: bold;
          color: #171719;
          margin: 0;
        }
        .score-subtitle {
          font-size: 18px;
          color: #B5B5B3;
          margin: 10px 0 20px 0;
        }
        .badge {
          display: inline-block;
          background-color: ${getBadgeColor(data.badge)};
          color: #ffffff;
          padding: 8px 16px;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .breakdown {
          margin: 40px 0;
        }
        .breakdown h3 {
          font-family: 'Bodoni Moda', serif;
          font-size: 24px;
          margin-bottom: 20px;
          color: #171719;
        }
        .score-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .score-label {
          font-weight: 500;
          text-transform: capitalize;
        }
        .score-value {
          font-weight: 600;
          color: ${getScoreColor(data.overall_score)};
        }
        .recommendations {
          background-color: #F1F1F1;
          padding: 30px;
          margin: 40px 0;
        }
        .recommendations h3 {
          font-family: 'Bodoni Moda', serif;
          font-size: 24px;
          margin-bottom: 20px;
          color: #171719;
        }
        .recommendation-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 15px;
        }
        .recommendation-number {
          background-color: #171719;
          color: #ffffff;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          margin-right: 12px;
          flex-shrink: 0;
        }
        .cta-section {
          text-align: center;
          margin: 40px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #171719;
          color: #ffffff;
          padding: 16px 32px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          margin: 10px;
        }
        .secondary-button {
          display: inline-block;
          border: 2px solid #171719;
          color: #171719;
          padding: 14px 30px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          margin: 10px;
        }
        .footer {
          background-color: #171719;
          color: #B5B5B3;
          padding: 30px;
          text-align: center;
          font-size: 14px;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          color: #B5B5B3;
          text-decoration: none;
          margin: 0 10px;
        }
        @media (max-width: 600px) {
          .container {
            margin: 0;
          }
          .header, .content, .footer {
            padding: 20px;
          }
          .main-score {
            font-size: 48px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SELFIE AI™</div>
          <h1 style="margin: 0; font-family: 'Bodoni Moda', serif; font-size: 28px;">
            Your Selfie Score is Ready!
          </h1>
        </div>
        
        <div class="content">
          <div class="score-display">
            <div class="main-score">${data.overall_score}</div>
            <div class="score-subtitle">out of 100</div>
            <div class="badge">${data.badge}</div>
          </div>
          
          <div class="breakdown">
            <h3>Score Breakdown</h3>
            <div class="score-item">
              <span class="score-label">Lighting</span>
              <span class="score-value">${data.sub_scores.lighting}/100</span>
            </div>
            <div class="score-item">
              <span class="score-label">Composition</span>
              <span class="score-value">${data.sub_scores.composition}/100</span>
            </div>
            <div class="score-item">
              <span class="score-label">Expression</span>
              <span class="score-value">${data.sub_scores.expression}/100</span>
            </div>
            <div class="score-item">
              <span class="score-label">Background</span>
              <span class="score-value">${data.sub_scores.background}/100</span>
            </div>
            <div class="score-item">
              <span class="score-label">Styling</span>
              <span class="score-value">${data.sub_scores.styling}/100</span>
            </div>
          </div>
          
          <div class="recommendations">
            <h3>Personalized Tips</h3>
            ${data.recommendations.map((rec, index) => `
              <div class="recommendation-item">
                <div class="recommendation-number">${index + 1}</div>
                <div>${rec}</div>
              </div>
            `).join('')}
          </div>
          
          <div class="cta-section">
            <h3 style="font-family: 'Bodoni Moda', serif; margin-bottom: 20px;">
              Share Your Score
            </h3>
            <a href="${data.share_url}" class="cta-button">
              View & Share
            </a>
            <br>
            <a href="/selfie-score" class="secondary-button">
              Score Another Selfie
            </a>
          </div>
          
          ${!data.isProUser ? `
            <div style="background-color: #F1F1F1; padding: 30px; text-align: center; margin: 40px 0;">
              <h3 style="font-family: 'Bodoni Moda', serif; margin-bottom: 15px;">
                Want Unlimited Scores?
              </h3>
              <p style="color: #B5B5B3; margin-bottom: 20px;">
                Upgrade to Pro and get unlimited selfie scores, detailed analytics, 
                and personalized coaching to level up your personal brand.
              </p>
              <a href="/products/starter-kit" class="cta-button">
                Upgrade to Pro
              </a>
            </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <div style="margin-bottom: 20px;">
            <strong>SELFIE AI™</strong><br>
            Transform your personal brand with AI
          </div>
          <div class="social-links">
            <a href="https://twitter.com/selfieai">Twitter</a>
            <a href="https://instagram.com/selfieai">Instagram</a>
            <a href="https://tiktok.com/@selfieai">TikTok</a>
          </div>
          <div style="margin-top: 20px; font-size: 12px;">
            You received this email because you used SELFIE AI™ to score your selfie.<br>
            <a href="/unsubscribe" style="color: #B5B5B3;">Unsubscribe</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateScoreEmailText(data: ScoreEmailData): string {
  return `
SELFIE AI™ - Your Selfie Score Results

Hi ${data.userName},

Your selfie has been analyzed! Here are your results:

OVERALL SCORE: ${data.overall_score}/100
BADGE: ${data.badge}

BREAKDOWN:
- Lighting: ${data.sub_scores.lighting}/100
- Composition: ${data.sub_scores.composition}/100
- Expression: ${data.sub_scores.expression}/100
- Background: ${data.sub_scores.background}/100
- Styling: ${data.sub_scores.styling}/100

PERSONALIZED TIPS:
${data.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

SHARE YOUR SCORE:
${data.share_url}

${!data.isProUser ? `
UPGRADE TO PRO:
Get unlimited scores, detailed analytics, and personalized coaching!
Visit: /products/starter-kit
` : ''}

Best regards,
The SELFIE AI™ Team

---
Transform your personal brand with AI
Unsubscribe: /unsubscribe
  `.trim();
} 