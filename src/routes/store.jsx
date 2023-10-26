import { useLoaderData } from 'react-router-dom';
import { SALLING_HOST, SALLING_TOKEN } from "../constants";

import { colorInRange } from '../lib/color';
import { dateText } from '../lib/date'
import { byRandom } from '../lib/sort'

// extract minimum and maximum discount values from list of offers
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

// see https://reactrouter.com/en/main/start/tutorial#loading-data
export async function loader({ params }) {
  const response = await fetch(`${SALLING_HOST}/v1/food-waste/${params.id}`, {
    headers: { Authorization: `bearer ${SALLING_TOKEN}` }
  });

  return await response.json();
}

export default function Store() {
  // see https://reactrouter.com/en/main/hooks/use-loader-data
  const { store, clearances } = useLoaderData();

  if (clearances.length == 0) return <h2>Der var desværre ingen gule mærker i denne butik</h2>;

  const range = getRange(clearances);

  // clearances.sort(by(x => x.offer.discount));
  clearances.sort(byRandom);

  return (
    <>
      <h1>{store.name}</h1>
      <ol className="grid">
        {clearances.map(({ product, offer }) => (
          <li
            key={product.ean}
            className="clearance"
            style={{ backgroundColor: colorInRange(range, offer.discount) }}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.description}
                width="200"
                height="200"
              />
            ) : (
              <p className="fallback">{product.description}</p>
            )}
            <span className="bottom left">
              <p>{offer.stock} tilbage</p>
              <p>{dateText(offer.lastUpdate)}</p>
            </span>
            <span className="bottom right">
              <p>Før <b>{offer.originalPrice}</b>,-</p>
              <p>Nu kun <b>{offer.newPrice}</b>,-</p>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
