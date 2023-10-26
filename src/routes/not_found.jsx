import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div class="text">
      <h1>Upsedasse</h1>
      <p>Der er noget galt, vil du ikke hellere se lidt på <Link to="/">tilbudsatlasset</Link>?</p>
    </div>
  );
}
