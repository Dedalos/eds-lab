/**
 * React part of the timeline block. `npm run build:react` writes it to the block folder as
 * timeline-app.js (v2/blocks/timeline/ in the portfolio, blocks/timeline/ in the EDS Lab).
 * The output is committed: neither the PHP hosting nor EDS has a build step.
 */
import { useId, useState, version } from 'react';
import { createRoot } from 'react-dom/client';

const ALL = null;

function Role({ role, labels, expanded, onToggle }) {
  const detailsId = useId();
  const hasDetails = role.bullets.length > 0;
  return (
    <li className="timeline-item">
      <div className="timeline-period"><p>{role.period}</p></div>
      <div className="timeline-body">
        <h3>{role.company}</h3>
        <p>{role.role}</p>
        {role.place && <p>{role.place}</p>}
        {role.summary && <p>{role.summary}</p>}
        {hasDetails && (
          <>
            <button
              type="button"
              className="timeline-details-toggle"
              aria-expanded={expanded}
              aria-controls={detailsId}
              onClick={onToggle}
            >
              {expanded ? labels.hideDetails : labels.showDetails}
            </button>
            <ul id={detailsId} hidden={!expanded}>
              {role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </>
        )}
      </div>
      <div className="timeline-tags">
        <ul>{role.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
      </div>
    </li>
  );
}

function Timeline({ roles, labels }) {
  const [tag, setTag] = useState(ALL);
  // Only the current role starts expanded; React mounts before the block is in view
  const [collapsed, setCollapsed] = useState(() => new Set(
    roles.slice(1).filter((role) => role.bullets.length).map((role) => role.company),
  ));

  const tags = [...new Set(roles.flatMap((role) => role.tags))];
  const visible = roles.filter((role) => tag === ALL || role.tags.includes(tag));
  const toggle = (company) => setCollapsed((current) => {
    const next = new Set(current);
    if (next.has(company)) next.delete(company); else next.add(company);
    return next;
  });

  return (
    <>
      <div className="timeline-controls">
        <div className="timeline-filters" role="group" aria-label={labels.filterBy}>
          {[ALL, ...tags].map((value) => (
            <button
              key={value ?? 'all'}
              type="button"
              aria-pressed={tag === value}
              onClick={() => setTag(value)}
            >
              {value ?? labels.all}
            </button>
          ))}
        </div>
        <p className="timeline-count" aria-live="polite">
          {labels.showing.replace('{n}', visible.length).replace('{total}', roles.length)}
        </p>
      </div>
      <ol className="timeline-list">
        {visible.map((role) => (
          <Role
            key={role.company}
            role={role}
            labels={labels}
            expanded={!collapsed.has(role.company)}
            onToggle={() => toggle(role.company)}
          />
        ))}
      </ol>
    </>
  );
}

export default function mount(block, roles, placeholders) {
  const labels = {
    filterBy: 'Filter by technology',
    all: 'All',
    showing: 'Showing {n} of {total} roles',
    showDetails: 'Show details',
    hideDetails: 'Hide details',
    ...placeholders,
  };
  const start = performance.now();
  createRoot(block).render(<Timeline roles={roles} labels={labels} />);
  block.dataset.runtime = `   React ${version}, mounted at ${Math.round(start)} ms`;
}
