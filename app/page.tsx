'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function Home() {
  const [address, setAddress] = useState('');
  const [target, setTarget] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');
    
    const { error } = await supabase.from('alerts').insert([{
      contract_address: address,
      target_market_cap: Number(target),
      email: email
    }]);

    setIsLoading(false);

    if (error) {
      console.error(error);
      setStatus('error');
    } else {
      setStatus('success');
      setAddress('');
      setTarget('');
      setEmail('');
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        body { margin: 0; background-color: #09090b; color: white; overflow-x: hidden; }
        
        .bg-glow { 
          position: absolute; width: 800px; height: 800px; 
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%); 
          top: 50%; left: 50%; transform: translate(-50%, -50%); 
          z-index: -1; pointer-events: none; 
        }
        
        .container { 
          min-height: 100vh; display: flex; flex-direction: column; 
          align-items: center; justify-content: center; 
          padding: 20px; position: relative; 
        }
        
        .glass-card { 
          background: rgba(24, 24, 27, 0.65); 
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          padding: 40px; border-radius: 24px; 
          width: 100%; max-width: 420px; 
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1); 
        }
        
        .header-icon {
          font-size: 48px; text-align: center; margin-bottom: 16px;
          filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.4));
        }

        .title { 
          font-size: 32px; font-weight: 800; text-align: center; margin: 0 0 12px 0; 
          background: linear-gradient(135deg, #ffffff, #a1a1aa); 
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
          letter-spacing: -0.5px;
        }
        
        .subtitle { 
          color: #a1a1aa; text-align: center; font-size: 15px; 
          margin-bottom: 32px; line-height: 1.5; font-weight: 400;
        }
        
        .input-group { margin-bottom: 20px; }
        
        .label { 
          display: flex; justify-content: space-between;
          font-size: 12px; font-weight: 600; color: #a1a1aa; 
          margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; 
        }
        
        .input { 
          width: 100%; background: rgba(0, 0, 0, 0.4); 
          border: 1px solid rgba(255, 255, 255, 0.1); 
          padding: 16px; border-radius: 12px; color: white; 
          font-size: 15px; outline: none; transition: all 0.2s ease; 
        }
        
        .input:focus { 
          border-color: #6366f1; background: rgba(0, 0, 0, 0.6); 
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15); 
        }
        
        .input::placeholder { color: #52525b; }
        
        .button { 
          width: 100%; background: linear-gradient(135deg, #4f46e5, #7c3aed); 
          color: white; padding: 16px; border-radius: 12px; border: none; 
          font-size: 16px; font-weight: 600; cursor: pointer; 
          transition: all 0.3s ease; margin-top: 12px; 
          text-shadow: 0 1px 2px rgba(0,0,0,0.2); 
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        
        .button:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 12px 24px -8px rgba(124, 58, 237, 0.6); 
        }
        
        .button:active { transform: translateY(0); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
        .button:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        
        .status-message { 
          text-align: center; font-size: 14px; margin-top: 20px; 
          font-weight: 500; padding: 12px; border-radius: 8px;
        }
        .status-success { background: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); }
        .status-error { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }
      `}</style>

      <div className="container">
        <div className="bg-glow"></div>
        
        <div className="glass-card">
          <div className="header-icon">🔔</div>
          <h1 className="title">MailMeWhen</h1>
          <p className="subtitle">
            Don't stare at the charts. Set an alert and get notified the exact second a token hits your target.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="label">Token Contract Address</label>
              <input 
                placeholder="e.g. 7GCihgDB8fe6KNjn..." 
                className="input"
                value={address}
                onChange={e => setAddress(e.target.value)} 
                required 
              />
            </div>

            <div className="input-group">
              <label className="label">
                Target Market Cap <span>(USD)</span>
              </label>
              <input 
                placeholder="e.g. 1000000" 
                type="number"
                className="input"
                value={target}
                onChange={e => setTarget(e.target.value)} 
                required 
              />
            </div>

            <div className="input-group">
              <label className="label">Delivery Email</label>
              <input 
                placeholder="you@domain.com" 
                type="email"
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="button" disabled={isLoading}>
              {isLoading ? 'Setting Alert...' : 'Create Alert'}
            </button>

            {status === 'success' && (
              <div className="status-message status-success">
                🎯 Alert saved! We'll email you when it hits.
              </div>
            )}
            {status === 'error' && (
              <div className="status-message status-error">
                Failed to save alert. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}