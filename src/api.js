export default function api(base){
  console.log("printing: api -> base", base);
  return {
    getSeats: (showId) => fetch(`${base}/shows/${showId}/seats`).then(r=>r.json()),
    reserve: (body) => fetch(`${base}/reserve`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body) }).then(r=>r.json()),
    book: (body) => fetch(`${base}/book`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body) }).then(r=>r.json()),
    cancel: (body) => fetch(`${base}/cancel`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body) }).then(r=>r.json()),
  }
}
