// src/App.tsx
import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import type { Neo } from './types.js'
import Table from 'react-bootstrap/Table'
import { Button, Container } from 'react-bootstrap'

// 1 — Sort key and order types
type SortKey = 'size' | 'closest' | 'velocity'
type SortOrder = 'asc' | 'desc'

const API_BASE = 'http://localhost:3000'

const App: React.FC = () => {
  // 2 — Date picker state
  const today = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState<string>(today)
  const [endDate, setEndDate] = useState<string>(today)

  // 3 — Data fetch state
  const [neos, setNeos] = useState<Neo[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  // 4 — Sorting state
  const [sortKey, setSortKey] = useState<SortKey>('size')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // 5 — Fetch function
  const fetchNeos = async () => {
    setLoading(true)
    setError('')
    try {
      const resp = await axios.get<Neo[]>(API_BASE, {
        params: { start_date: startDate, end_date: endDate },
      })
      setNeos(resp.data)
    } catch (err: any) {
      // handle Axios or network errors
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false)
    }
  };

  // 6 — Initial load
  useEffect(() => {
    fetchNeos();
  }, []);

  // 7 — Memoized sorting
  const sortedNeos = useMemo(() => {
    return [...neos].sort((a, b) => {
      let diff: number;
      switch (sortKey) {
        case 'size':
          const avgA = (a.sizeMeters.min + a.sizeMeters.max) / 2
          const avgB = (b.sizeMeters.min + b.sizeMeters.max) / 2
          diff = avgA - avgB
          break
        case 'closest':
          diff = a.closestKm - b.closestKm
          break
        case 'velocity':
          diff = a.velocityKph - b.velocityKph
          break
      }
      return sortOrder === 'asc' ? diff : -diff
    })
  }, [neos, sortKey, sortOrder])

  // 8 — Render UI
  return (
  
    <Container className=' d-flex gap-3 flex-column justify-content-center '>
      <div className='container '>
        <div className='row justify-content-center mt-5 '>
          <div className='col-md-10'>
            
            <div className='d-flex flex-row justify-content-center align-items-center gap-2 mb-5' >
              <h1 className='text-primary '>NASA Near-Earth Objects</h1>
              <a className='btn btn-secondary text-white text-decoration-none'  href="http://localhost:3000/docs" target="_blank">API Docs</a>
            </div>
            
            <div className='d-flex flex-row mb-3 justify-content-center gap-5'> 
              {/* Date Pickers & Fetch Button */}
              
              <div className='d-flex flex-row align-items-center me-3'>
                <label className='me-2'>
                  Start:&nbsp;
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </label>
                
                <label className='me-2'>
                  End:&nbsp;
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </label>
                
                <Button className="btn btn-primary" onClick={fetchNeos} disabled={loading}>
                  {loading ? 'Loading…' : 'Fetch'}
                </Button>
              </div>

            {/* Sort Controls */}
              <div className='d-flex flex-row align-items-center ms-2'>
                <label className='me-2'>
                  Sort by:&nbsp;
                  <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}>
                    <option value="size">Size</option>
                    <option value="closest">Closeness</option>
                    <option value="velocity">Velocity</option>
                  </select>
                </label>

                <Button className="btn btn-primary" onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}>
                  {sortOrder === 'asc' ? '⬆️ Ascending' : '⬇️ Descending'}
                </Button>
              </div>
            </div>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Data Table */}
      {!error && (
    
              <Table striped bordered hover size="md" responsive="ms">
                <thead >
                  <tr className='table-primary me-2'>
                    <th>Name </th>
                    <th >Size (m)</th>
                    <th >Missed By (km)</th>
                    <th >Velocity (km/h)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedNeos.map((neo, idx) => (
                    <tr key={idx}>
                      <td>{neo.name}</td>
                      <td>
                        {neo.sizeMeters.min.toFixed(1)} – {neo.sizeMeters.max.toFixed(1)}
                      </td>
                      <td>{neo.closestKm.toFixed(0)}</td>
                      <td>{neo.velocityKph.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>      
              )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default App;
