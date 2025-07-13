
import { useState, useEffect } from 'react';
import styles from './DashboardPage.module.css';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import CreateUrlForm from './CreateUrlForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useCrawlApi } from '../../hooks/useCrawlApi';
import ChartLinks from './ChartLinks';

export default function DashboardPage() {
  return (
    <div style={{ paddingTop: 56, minHeight: '100vh', background: '#f8f9fa' }}>
      <Navbar onSignOut={() => { localStorage.removeItem('authToken'); window.location.reload(); }} />
      <Routes>
        <Route path="/" element={<DashboardTable />} />
        <Route path="detail/:id" element={<DashboardDetail />} />
      </Routes>
    </div>
  );
}

function DashboardTable() {
  const { urls, loading } = useCrawlApi();
  const navigate = useNavigate();
  // State for filters, search, pagination, and modal
  const [globalSearch, setGlobalSearch] = useState("");
  const [filters, setFilters] = useState({ title: "", htmlVersion: "", internalLinks: "" });
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);

  const [selected, setSelected] = useState<any[]>([]);
  // Stubs for actions
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  const { bulkAnalysis, stopAnalysis, deleteSelectedUrls } = useCrawlApi();

  const handleStart = async () => {
    if (!selected.length) return;
    await bulkAnalysis(selected);
    setSelected([]); // Uncheck all checkboxes after successful start
    // Optionally show success feedback here
  };

  const handleStop = async () => {
    if (!selected.length) return;
    await stopAnalysis(selected);
    // Optionally show success feedback here
  };

  const deleteUrls = async () => {
    if (!selected.length) return;
    await deleteSelectedUrls(selected);
    // Optionally show success feedback here
  };
  const hasRows = (urls && urls.length > 0);
  const startEnabled = selected.length > 0 && hasRows;
  const stopEnabled = false;
  const anyChecked = selected.length > 0 && hasRows;
  // Table data stub
  const sortedUrls = urls || [];
  const rowsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(sortedUrls.length / rowsPerPage));

  return (
    <div className={styles.container}>
      <div className="row justify-content-center w-100" style={{ marginTop: 0 }}>
        <div className="col-12 col-md-10 col-lg-8 p-0" style={{ margin: 0 }}>
          <h2 className="mt-4 mb-3 text-start">Dashboard</h2>
          {/* Global search and column filters */}
          <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
            <input
              type="text"
              className="form-control"
              style={{ maxWidth: 260 }}
              placeholder="Global search..."
              value={globalSearch}
              onChange={e => { setGlobalSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            {/* Loading overlay to prevent UI shake */}
            {loading && (
              <div className={styles.loadingOverlay}>
                <div className="spinner-border text-primary" role="status" style={{ width: 40, height: 40 }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            <div className="row g-2 mb-3">
              <div className="col-12 col-md-6 d-flex gap-2 justify-content-md-start justify-content-center order-1 order-md-1">
                <button className="btn-start" onClick={handleStart} disabled={!startEnabled}>Start</button>
                <button className="btn-stop" onClick={handleStop} disabled={!stopEnabled}>Stop</button>
              </div>
              <div className="col-12 col-md-6 d-flex gap-2 justify-content-md-end justify-content-center order-2 order-md-2">
                <button className="btn-create" onClick={() => setShowCreate(true)}>Create</button>
                <button className="btn-delete" onClick={() => setShowDeleteConfirm(true)} disabled={!anyChecked}>Delete Selected</button>
                {showDeleteConfirm && (
                  <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.25)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #e0e0e0', padding: 32, minWidth: 320, maxWidth: 400, width: '100%', textAlign: 'center' }}>
                      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 24 }}>Are you sure you want to delete the selected URLs?</div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                        <button
                          style={{ background: '#2d4739', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                          onClick={() => { setShowDeleteConfirm(false); deleteUrls(); }}
                        >Yes</button>
                        <button
                          style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                          onClick={() => setShowDeleteConfirm(false)}
                        >No</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {showCreate && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.25)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CreateUrlForm
                  onCreate={(url: string) => {
                    setShowCreate(false);
                    // TODO: Add logic to actually create the URL (API call or state update)
                  }}
                  onCancel={() => setShowCreate(false)}
                />
              </div>
            )}

            <div className={styles.dashboardCard}>
              <div className="table-responsive">
                <table className="table table-striped align-middle" style={{ minHeight: 320, tableLayout: 'fixed', width: '100%', margin: 0 }}>
                  <colgroup>
                    <col style={{ width: '60px' }} />
                    <col style={{ minWidth: '220px' }} />
                    <col style={{ minWidth: '120px' }} />
                    <col style={{ minWidth: '180px' }} />
                    <col style={{ minWidth: '220px' }} />
                    <col style={{ minWidth: '120px' }} />
                    <col style={{ minWidth: '120px' }} />
                    <col style={{ minWidth: '140px' }} />
                    <col style={{ minWidth: '120px' }} />
                    <col style={{ width: '70px' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px 18px' }}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selected.length === sortedUrls.length && sortedUrls.length > 0}
                          onChange={() => {
                            if (selected.length === sortedUrls.length) {
                              setSelected([]);
                            } else {
                              setSelected(sortedUrls.map((u: any) => u.id));
                            }
                          }}
                        />
                      </th>
                      <th style={{ padding: '12px 18px' }}>URL</th>
                      <th style={{ padding: '12px 18px' }}>HTML Version</th>
                      <th style={{ padding: '12px 18px' }}>Title</th>
                      <th style={{ padding: '12px 18px' }}>Headings (H1-H6)</th>
                      <th style={{ padding: '12px 18px' }}>#Internal Links</th>
                      <th style={{ padding: '12px 18px' }}>External Links</th>
                      <th style={{ padding: '12px 18px' }}>Inaccessible Links</th>
                      <th style={{ padding: '12px 18px' }}>Status</th>
                      <th style={{ padding: '12px 18px' }}>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUrls.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((url: any) => (
                      <tr key={url.id}>
                        <td style={{ padding: '12px 18px' }}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selected.includes(url.id)}
                            onChange={() => {
                              if (selected.includes(url.id)) {
                                setSelected(selected.filter(id => id !== url.id));
                              } else {
                                setSelected([...selected, url.id]);
                              }
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px 18px', wordBreak: 'break-all' }}>{url.url}</td>
                        <td style={{ padding: '12px 18px' }}>{url.htmlVersion}</td>
                        <td style={{ padding: '12px 18px' }}>{url.title}</td>
                        <td style={{ padding: '12px 18px' }}>{`H1:${url.headings?.h1 ?? 0} H2:${url.headings?.h2 ?? 0} H3:${url.headings?.h3 ?? 0} H4:${url.headings?.h4 ?? 0} H5:${url.headings?.h5 ?? 0} H6:${url.headings?.h6 ?? 0}`}</td>
                        <td style={{ padding: '12px 18px' }}>{url.internalLinks}</td>
                        <td style={{ padding: '12px 18px' }}>{url.externalLinks}</td>
                        <td style={{ padding: '12px 18px' }}>{url.inaccessibleLinks}</td>
                        <td style={{ padding: '12px 18px' }}>
                        <span
                          className={
                            styles.status + ' ' +
                            (url.status.toLowerCase() === 'running'
                              ? styles.statusRunning
                              : url.status.toLowerCase() === 'done'
                              ? styles.statusDone
                              : url.status.toLowerCase() === 'error'
                              ? styles.statusError
                              : '')
                          }
                        >
                          {url.status.charAt(0).toUpperCase() + url.status.slice(1)}
                        </span>
                        </td>
                        <td style={{ padding: '12px 18px', textAlign: 'center' }}>
                          <button
                            onClick={() => navigate(`/dashboard/detail/${url.id}`)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} style={{ color: '#1976d2', fontSize: 18 }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination controls */}
            <div className="d-flex justify-content-center align-items-center my-3">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-outline-secondary me-2">
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-outline-secondary ms-2">
                Next
              </button>
            </div>
          </div> {/* End of relative wrapper */}
        </div>
      </div>
    </div>
  );
}




function DashboardDetail() {
  const { id } = useParams();
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { fetchRecordById } = useCrawlApi();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchRecordById(id)
      .then(data => setDetailData(data))
      .finally(() => setLoading(false));
  }, [id, fetchRecordById]);

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
  if (!detailData) return <div style={{ padding: 32 }}>No data found</div>;

  return (
    <div style={{ padding: 32, maxWidth: 700, margin: '0 auto' }}>
      <h3>Detail for ID: {id}</h3>
      <ChartLinks
        internal={detailData.chartData?.internal ?? 0}
        external={detailData.chartData?.external ?? 0}
      />
      {/* List of broken links */}
      <div style={{ marginTop: 32 }}>
        <h5>Broken Links</h5>
        {detailData.linksData && detailData.linksData.length > 0 ? (
          <ul>
            {detailData.linksData.map((link: any, idx: number) => (
              <li key={idx}>
                <span style={{ color: '#d32f2f' }}>{link.url}</span> (Status: {link.status})
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ color: '#888' }}>No broken links</div>
        )}
      </div>
    </div>
  );
}


