import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SALLING_TOKEN } from "./constants";

const host = "https://api.sallinggroup.com/v1/"


const daysInPast = (s) => {
  //get date from string
  console.log(s)
  var b = s.split(/\D+/);
  const date = new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]))
  const today = new Date()
  const timeDifference = today - date;

  const daysInPast = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return daysInPast
}


const dateText = (stringDate) => {
  const d = daysInPast(stringDate)
  if (d == 0) {
    return <>Set i dag</>
  } else if (d == 1) {
    return <>Set i går</>
  } else {
    return <>Set for {d} dage siden</>
  }
}

function byDiscount(a, b) {
  return Math.random()
  return b.offer.discount - a.offer.discount
}

function colorInRange(range, value) {
  const [min, max] = range;
  const hue = (value - min) / (max - min) * 100;
  return `hsla(${hue}, 100%, 50%, 1)`;
}

function getRange(clearances) {
  let min = Infinity;
  let max = -Infinity;
  for (const clearance of clearances) {
    if (clearance.offer.discount < min) {
      min = clearance.offer.discount;
    }
    if (clearance.offer.discount > max) {
      max = clearance.offer.discount;
    }
  }
  return [min, max]
}



export default function Store() {
  const params = useParams();

  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(`${host}food-waste/${params.id}`, {
      headers: {
        Authorization: `bearer ${SALLING_TOKEN}`,
      },
    }).then(async (res) => {
      const data = await res.json()
      setData(data);
    });
  }, [])

  if (!data) return <h2>Indlæser</h2>;
  if (data.clearances.length == 0) return <h2>Der var desværre ingen gule mærker i denne butik</h2>;

  const { store, clearances } = data;

  const range = getRange(clearances);
  //console.log(clearances)
  return (
    <main>
      <h1>{store.name}</h1>
      <ol className="grid">
        {clearances.sort(byDiscount).map(clearance => (
          <li
            key={clearance.product.ean}
            className="clearance"
            style={{ background: colorInRange(range, clearance.offer.discount), display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            {clearance.product.image ? <img style={{ objectFit: "contain" }}
              src={clearance.product.image}
              alt={clearance.product.description}
              width="200"
              height="200"
            /> : <div style={{ fontSize: 30, overflowWrap: "break-word" }} >{clearance.product.description}</div>}
            <span className="bottom-left"><p>{clearance.offer.stock} tilbage</p><p>{dateText(clearance.offer.lastUpdate)}</p></span>
            {/*<span className="percentage">% {clearance.offer.percentDiscount}</span>*/}
            {/*<span className="original-price">før {clearance.offer.originalPrice},-</span>*/}
            <span className="bottom-right"><p>Før <b>{clearance.offer.originalPrice}</b>,-</p><p> Nu kun <b>{clearance.offer.newPrice}</b>,-</p></span>
            {/*<span className="new-price">nu kun {clearance.offer.newPrice},-</span>*/}
            {/*
              <h2>{clearance.product.description} ({clearance.offer.percentDiscount}%)</h2>
              <p>{clearance.offer.stock} tilbage!</p>
              <p>
                <del>{clearance.offer.originalPrice}</del>
                <span>{clearance.offer.newPrice}</span>
                <span>(spar {clearance.offer.discount})</span>
              </p>
            */}
          </li>
        ))}
      </ol>
    </main>
  )
}
