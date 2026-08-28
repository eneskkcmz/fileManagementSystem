import type { ReactNode } from 'react';

interface PlaceholderProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  phase?: string;
}

/**
 * Öncü ekran: sayfa henüz kodlanmadı, ama burada ne olacağını anlatır.
 * "features" TODO.md'deki ilgili fazdan gelir — beklentiyi netleştirir.
 */
export function Placeholder({ icon, title, description, features, phase }: PlaceholderProps) {
  return (
    <div className="placeholder">
      <div className="ph-hero">
        <div className="ph-icon">{icon}</div>
        <div className="ph-badge">Yakında</div>
        <h2 className="ph-title">{title}</h2>
        <p className="ph-desc">{description}</p>

        <ul className="feature-list">
          {features.map((f, i) => (
            <li key={i}>
              <span className="tick">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {phase && <div className="ph-foot">Yol haritası: <strong>{phase}</strong> — bkz. TODO.md</div>}
      </div>
    </div>
  );
}
