export function AboutSettings() {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
        }}>
          N
        </div>
        <h3 style={{ fontSize: '18px', color: '#1f2937', margin: '0 0 8px' }}>AI Nav</h3>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px' }}>版本 1.0.0</p>
        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>一个简洁美观的新标签页</p>
      </div>
    </div>
  );
}
