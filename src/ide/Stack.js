import { STACK } from './content';
import { getSkillIcon, dimColor } from './skills';
import { useInView } from './hooks';

function Skill({ item }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const Icon = getSkillIcon(item.icon);

  return (
    <div
      ref={ref}
      className={`skill${inView ? ' is-visible' : ''}`}
      style={{ '--skill-color': item.color, '--skill-level': `${item.level}%` }}
      title={`${item.name} — ${item.level}%`}
    >
      <span className="skill__icon" style={{ color: dimColor(item.color) }}>
        <Icon aria-hidden="true" />
      </span>

      <span className="skill__body">
        <span className="skill__name">{item.name}</span>
        <span className="skill__track">
          <span className="skill__fill" />
        </span>
      </span>

      <span className="skill__pct">{item.level}</span>
    </div>
  );
}

export default function Stack() {
  return (
    <section className="stack" id="stack" aria-label="Technical stack">
      <div className="section__head">
        <span className="section__num">01</span>
        <h2 className="section__title">The stack</h2>
      </div>
      <p className="section__sub">
        Twenty technologies I have shipped with. Anything above 80 is something I
        have run in production.
      </p>

      {STACK.map((group) => (
        <div className="stack__group" key={group.group}>
          <div className="stack__group-label">
            {group.group} — {group.blurb}
          </div>
          <div className="stack__grid">
            {group.items.map((item) => (
              <Skill item={item} key={item.name} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
