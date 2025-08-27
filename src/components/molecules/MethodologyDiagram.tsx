'use client';

export interface MethodologyDiagramProps {
  pattern: 'verification' | 'multi-agent' | 'excellence' | 'context' | 'risk';
  className?: string;
}

export function MethodologyDiagram({ pattern, className = '' }: MethodologyDiagramProps) {
  const baseClasses = `w-full max-w-md mx-auto ${className}`;

  switch (pattern) {
    case 'verification':
      return (
        <svg className={baseClasses} viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
          {/* Verification-First Flow */}
          <defs>
            <marker id="arrowhead1" markerWidth="10" markerHeight="7" 
              refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#0891b2" />
            </marker>
          </defs>
          
          {/* AI Input */}
          <rect x="20" y="20" width="80" height="40" rx="8" fill="#f0fdfa" stroke="#0891b2" strokeWidth="2"/>
          <text x="60" y="35" textAnchor="middle" className="text-xs font-medium" fill="#0891b2">AI</text>
          <text x="60" y="48" textAnchor="middle" className="text-xs" fill="#0891b2">Suggestion</text>
          
          {/* Verification Step */}
          <rect x="110" y="80" width="80" height="40" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
          <text x="150" y="95" textAnchor="middle" className="text-xs font-medium" fill="#f59e0b">Systematic</text>
          <text x="150" y="108" textAnchor="middle" className="text-xs" fill="#f59e0b">Verification</text>
          
          {/* Decision Diamond */}
          <polygon points="240,60 270,90 240,120 210,90" fill="#dcfce7" stroke="#22c55e" strokeWidth="2"/>
          <text x="240" y="85" textAnchor="middle" className="text-xs font-medium" fill="#22c55e">Valid?</text>
          <text x="240" y="98" textAnchor="middle" className="text-xs" fill="#22c55e">Verified?</text>
          
          {/* Action */}
          <rect x="200" y="140" width="80" height="40" rx="8" fill="#dcfce7" stroke="#22c55e" strokeWidth="2"/>
          <text x="240" y="155" textAnchor="middle" className="text-xs font-medium" fill="#22c55e">Take</text>
          <text x="240" y="168" textAnchor="middle" className="text-xs" fill="#22c55e">Action</text>
          
          {/* Reject */}
          <rect x="20" y="140" width="80" height="40" rx="8" fill="#fee2e2" stroke="#ef4444" strokeWidth="2"/>
          <text x="60" y="155" textAnchor="middle" className="text-xs font-medium" fill="#ef4444">Reject/</text>
          <text x="60" y="168" textAnchor="middle" className="text-xs" fill="#ef4444">Refine</text>
          
          {/* Arrows */}
          <line x1="100" y1="50" x2="130" y2="80" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead1)"/>
          <line x1="170" y1="90" x2="210" y2="90" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead1)"/>
          <line x1="240" y1="120" x2="240" y2="140" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowhead1)"/>
          <line x1="210" y1="90" x2="100" y2="150" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead1)"/>
          
          {/* Labels */}
          <text x="120" y="70" className="text-xs" fill="#64748b">verify</text>
          <text x="250" y="135" className="text-xs" fill="#64748b">✓</text>
          <text x="140" y="130" className="text-xs" fill="#64748b">✗</text>
        </svg>
      );

    case 'multi-agent':
      return (
        <svg className={baseClasses} viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
          {/* Multi-Agent Coordination */}
          <defs>
            <marker id="arrowhead2" markerWidth="10" markerHeight="7" 
              refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#ea580c" />
            </marker>
          </defs>
          
          {/* Strategy Agent */}
          <circle cx="60" cy="60" r="35" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
          <text x="60" y="55" textAnchor="middle" className="text-xs font-medium" fill="#f59e0b">Strategy</text>
          <text x="60" y="68" textAnchor="middle" className="text-xs" fill="#f59e0b">Agent</text>
          
          {/* Implementation Agent */}
          <circle cx="260" cy="60" r="35" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="2"/>
          <text x="260" y="55" textAnchor="middle" className="text-xs font-medium" fill="#8b5cf6">Execution</text>
          <text x="260" y="68" textAnchor="middle" className="text-xs" fill="#8b5cf6">Agent</text>
          
          {/* Review Agent */}
          <circle cx="160" cy="160" r="35" fill="#dcfce7" stroke="#22c55e" strokeWidth="2"/>
          <text x="160" y="155" textAnchor="middle" className="text-xs font-medium" fill="#22c55e">Review</text>
          <text x="160" y="168" textAnchor="middle" className="text-xs" fill="#22c55e">Agent</text>
          
          {/* Coordination Hub */}
          <rect x="130" y="30" width="60" height="60" rx="12" fill="#f1f5f9" stroke="#64748b" strokeWidth="2"/>
          <text x="160" y="50" textAnchor="middle" className="text-xs font-medium" fill="#64748b">Context</text>
          <text x="160" y="63" textAnchor="middle" className="text-xs" fill="#64748b">Handoff</text>
          <text x="160" y="76" textAnchor="middle" className="text-xs" fill="#64748b">Hub</text>
          
          {/* Connections */}
          <line x1="95" y1="60" x2="130" y2="60" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead2)"/>
          <line x1="190" y1="60" x2="225" y2="60" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrowhead2)"/>
          <line x1="160" y1="90" x2="160" y2="125" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowhead2)"/>
          <line x1="125" y1="160" x2="95" y2="90" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5"/>
          <line x1="195" y1="160" x2="225" y2="90" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5"/>
          
          {/* Labels */}
          <text x="112" y="55" className="text-xs" fill="#64748b">plan</text>
          <text x="207" y="55" className="text-xs" fill="#64748b">build</text>
          <text x="165" y="110" className="text-xs" fill="#64748b">verify</text>
          <text x="70" y="120" className="text-xs" fill="#64748b">feedback</text>
          <text x="245" y="120" className="text-xs" fill="#64748b">iterate</text>
        </svg>
      );

    case 'excellence':
      return (
        <svg className={baseClasses} viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
          {/* Excellence Flywheel */}
          <defs>
            <marker id="arrowhead3" markerWidth="10" markerHeight="7" 
              refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#0891b2" />
            </marker>
          </defs>
          
          {/* Central Hub */}
          <circle cx="140" cy="140" r="40" fill="#f0fdfa" stroke="#0891b2" strokeWidth="3"/>
          <text x="140" y="135" textAnchor="middle" className="text-sm font-bold" fill="#0891b2">Excellence</text>
          <text x="140" y="150" textAnchor="middle" className="text-sm font-bold" fill="#0891b2">Flywheel</text>
          
          {/* Quality Systems */}
          <ellipse cx="80" cy="80" rx="45" ry="25" fill="#dcfce7" stroke="#22c55e" strokeWidth="2"/>
          <text x="80" y="75" textAnchor="middle" className="text-xs font-medium" fill="#22c55e">Quality</text>
          <text x="80" y="88" textAnchor="middle" className="text-xs" fill="#22c55e">Systems</text>
          
          {/* Speed */}
          <ellipse cx="200" cy="80" rx="45" ry="25" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
          <text x="200" y="75" textAnchor="middle" className="text-xs font-medium" fill="#f59e0b">Increased</text>
          <text x="200" y="88" textAnchor="middle" className="text-xs" fill="#f59e0b">Speed</text>
          
          {/* Documentation */}
          <ellipse cx="200" cy="200" rx="45" ry="25" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="2"/>
          <text x="200" y="195" textAnchor="middle" className="text-xs font-medium" fill="#8b5cf6">Better</text>
          <text x="200" y="208" textAnchor="middle" className="text-xs" fill="#8b5cf6">Documentation</text>
          
          {/* Reusability */}
          <ellipse cx="80" cy="200" rx="45" ry="25" fill="#fee2e2" stroke="#ef4444" strokeWidth="2"/>
          <text x="80" y="195" textAnchor="middle" className="text-xs font-medium" fill="#ef4444">Pattern</text>
          <text x="80" y="208" textAnchor="middle" className="text-xs" fill="#ef4444">Reusability</text>
          
          {/* Flywheel Arrows */}
          <path d="M 110 110 Q 140 100 170 110" fill="none" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead3)"/>
          <path d="M 170 110 Q 210 140 170 170" fill="none" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead3)"/>
          <path d="M 170 170 Q 140 180 110 170" fill="none" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead3)"/>
          <path d="M 110 170 Q 70 140 110 110" fill="none" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead3)"/>
          
          {/* Benefit Labels */}
          <text x="140" y="50" textAnchor="middle" className="text-xs font-medium" fill="#64748b">Less Debugging</text>
          <text x="250" y="140" textAnchor="middle" className="text-xs font-medium" fill="#64748b">Faster</text>
          <text x="250" y="153" textAnchor="middle" className="text-xs font-medium" fill="#64748b">Iteration</text>
          <text x="140" y="240" textAnchor="middle" className="text-xs font-medium" fill="#64748b">Knowledge Reuse</text>
          <text x="30" y="140" textAnchor="middle" className="text-xs font-medium" fill="#64748b">Systematic</text>
          <text x="30" y="153" textAnchor="middle" className="text-xs font-medium" fill="#64748b">Improvement</text>
        </svg>
      );

    case 'context':
      return (
        <svg className={baseClasses} viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
          {/* Context-Driven Decision Tree */}
          <defs>
            <marker id="arrowhead4" markerWidth="10" markerHeight="7" 
              refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#ea580c" />
            </marker>
          </defs>
          
          {/* Root: Problem */}
          <rect x="120" y="20" width="60" height="30" rx="6" fill="#f1f5f9" stroke="#64748b" strokeWidth="2"/>
          <text x="150" y="35" textAnchor="middle" className="text-xs font-medium" fill="#64748b">Problem</text>
          <text x="150" y="46" textAnchor="middle" className="text-xs" fill="#64748b">Context</text>
          
          {/* Context Factors */}
          <ellipse cx="60" cy="80" rx="35" ry="15" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
          <text x="60" y="83" textAnchor="middle" className="text-xs" fill="#f59e0b">Stakes</text>
          
          <ellipse cx="150" cy="80" rx="35" ry="15" fill="#dcfce7" stroke="#22c55e" strokeWidth="2"/>
          <text x="150" y="83" textAnchor="middle" className="text-xs" fill="#22c55e">Timeline</text>
          
          <ellipse cx="240" cy="80" rx="35" ry="15" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="2"/>
          <text x="240" y="83" textAnchor="middle" className="text-xs" fill="#8b5cf6">Audience</text>
          
          {/* Decision Matrix */}
          <rect x="20" y="120" width="70" height="25" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="1"/>
          <text x="55" y="130" textAnchor="middle" className="text-xs font-medium" fill="#ef4444">High Stakes</text>
          <text x="55" y="140" textAnchor="middle" className="text-xs" fill="#ef4444">Deep Analysis</text>
          
          <rect x="115" y="120" width="70" height="25" rx="4" fill="#f0fdfa" stroke="#0891b2" strokeWidth="1"/>
          <text x="150" y="130" textAnchor="middle" className="text-xs font-medium" fill="#0891b2">Tight Timeline</text>
          <text x="150" y="140" textAnchor="middle" className="text-xs" fill="#0891b2">Quick Iteration</text>
          
          <rect x="210" y="120" width="70" height="25" rx="4" fill="#f3e8ff" stroke="#a855f7" strokeWidth="1"/>
          <text x="245" y="130" textAnchor="middle" className="text-xs font-medium" fill="#a855f7">Technical</text>
          <text x="245" y="140" textAnchor="middle" className="text-xs" fill="#a855f7">Implementation</text>
          
          {/* AI Approach Outcomes */}
          <rect x="20" y="170" width="70" height="25" rx="4" fill="#fecaca" stroke="#ef4444" strokeWidth="1"/>
          <text x="55" y="180" textAnchor="middle" className="text-xs" fill="#ef4444">Multi-stage</text>
          <text x="55" y="190" textAnchor="middle" className="text-xs" fill="#ef4444">Verification</text>
          
          <rect x="115" y="170" width="70" height="25" rx="4" fill="#cffafe" stroke="#0891b2" strokeWidth="1"/>
          <text x="150" y="180" textAnchor="middle" className="text-xs" fill="#0891b2">Rapid</text>
          <text x="150" y="190" textAnchor="middle" className="text-xs" fill="#0891b2">Prototyping</text>
          
          <rect x="210" y="170" width="70" height="25" rx="4" fill="#e9d5ff" stroke="#a855f7" strokeWidth="1"/>
          <text x="245" y="180" textAnchor="middle" className="text-xs" fill="#a855f7">Code-focused</text>
          <text x="245" y="190" textAnchor="middle" className="text-xs" fill="#a855f7">AI Tools</text>
          
          {/* Connections */}
          <line x1="130" y1="50" x2="80" y2="70" stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowhead4)"/>
          <line x1="150" y1="50" x2="150" y2="65" stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowhead4)"/>
          <line x1="170" y1="50" x2="220" y2="70" stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowhead4)"/>
          
          <line x1="60" y1="95" x2="55" y2="120" stroke="#f59e0b" strokeWidth="1" markerEnd="url(#arrowhead4)"/>
          <line x1="150" y1="95" x2="150" y2="120" stroke="#22c55e" strokeWidth="1" markerEnd="url(#arrowhead4)"/>
          <line x1="240" y1="95" x2="245" y2="120" stroke="#8b5cf6" strokeWidth="1" markerEnd="url(#arrowhead4)"/>
          
          <line x1="55" y1="145" x2="55" y2="170" stroke="#ef4444" strokeWidth="1" markerEnd="url(#arrowhead4)"/>
          <line x1="150" y1="145" x2="150" y2="170" stroke="#0891b2" strokeWidth="1" markerEnd="url(#arrowhead4)"/>
          <line x1="245" y1="145" x2="245" y2="170" stroke="#a855f7" strokeWidth="1" markerEnd="url(#arrowhead4)"/>
        </svg>
      );

    case 'risk':
      return (
        <svg className={baseClasses} viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
          {/* Risk-Based Evaluation Matrix */}
          <defs>
            <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dcfce7" />
              <stop offset="50%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fee2e2" />
            </linearGradient>
          </defs>
          
          {/* Background Grid */}
          <rect x="40" y="40" width="240" height="160" fill="url(#riskGradient)" stroke="#64748b" strokeWidth="1" opacity="0.3"/>
          
          {/* Axes */}
          <line x1="40" y1="200" x2="280" y2="200" stroke="#64748b" strokeWidth="2"/>
          <line x1="40" y1="200" x2="40" y2="40" stroke="#64748b" strokeWidth="2"/>
          
          {/* Axis Labels */}
          <text x="160" y="220" textAnchor="middle" className="text-sm font-medium" fill="#64748b">Implementation Complexity →</text>
          <text x="20" y="120" textAnchor="middle" className="text-sm font-medium" fill="#64748b" transform="rotate(-90, 20, 120)">Impact Level ↑</text>
          
          {/* Risk Quadrants */}
          <rect x="40" y="40" width="120" height="80" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" opacity="0.5"/>
          <text x="100" y="55" textAnchor="middle" className="text-xs font-bold" fill="#ef4444">High Impact</text>
          <text x="100" y="67" textAnchor="middle" className="text-xs font-bold" fill="#ef4444">High Complexity</text>
          <text x="100" y="105" textAnchor="middle" className="text-xs font-medium" fill="#ef4444">Proceed with</text>
          <text x="100" y="115" textAnchor="middle" className="text-xs font-medium" fill="#ef4444">Extreme Caution</text>
          
          <rect x="160" y="40" width="120" height="80" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" opacity="0.5"/>
          <text x="220" y="55" textAnchor="middle" className="text-xs font-bold" fill="#f59e0b">High Impact</text>
          <text x="220" y="67" textAnchor="middle" className="text-xs font-bold" fill="#f59e0b">Low Complexity</text>
          <text x="220" y="105" textAnchor="middle" className="text-xs font-medium" fill="#f59e0b">Priority</text>
          <text x="220" y="115" textAnchor="middle" className="text-xs font-medium" fill="#f59e0b">Implementation</text>
          
          <rect x="40" y="120" width="120" height="80" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" opacity="0.5"/>
          <text x="100" y="135" textAnchor="middle" className="text-xs font-bold" fill="#22c55e">Low Impact</text>
          <text x="100" y="147" textAnchor="middle" className="text-xs font-bold" fill="#22c55e">High Complexity</text>
          <text x="100" y="185" textAnchor="middle" className="text-xs font-medium" fill="#22c55e">Avoid or</text>
          <text x="100" y="195" textAnchor="middle" className="text-xs font-medium" fill="#22c55e">Simplify</text>
          
          <rect x="160" y="120" width="120" height="80" fill="#f0fdfa" stroke="#0891b2" strokeWidth="1" opacity="0.5"/>
          <text x="220" y="135" textAnchor="middle" className="text-xs font-bold" fill="#0891b2">Low Impact</text>
          <text x="220" y="147" textAnchor="middle" className="text-xs font-bold" fill="#0891b2">Low Complexity</text>
          <text x="220" y="185" textAnchor="middle" className="text-xs font-medium" fill="#0891b2">Quick Wins</text>
          
          {/* Sample AI Implementation Points */}
          <circle cx="90" cy="70" r="4" fill="#ef4444"/>
          <text x="95" y="65" className="text-xs" fill="#ef4444">Full Automation</text>
          
          <circle cx="230" cy="70" r="4" fill="#f59e0b"/>
          <text x="235" y="65" className="text-xs" fill="#f59e0b">AI Assistant</text>
          
          <circle cx="90" cy="150" r="4" fill="#22c55e"/>
          <text x="95" y="145" className="text-xs" fill="#22c55e">Complex Integration</text>
          
          <circle cx="230" cy="150" r="4" fill="#0891b2"/>
          <text x="235" y="145" className="text-xs" fill="#0891b2">Simple Tools</text>
        </svg>
      );

    default:
      return <div className={baseClasses}>Diagram not found</div>;
  }
}