
export default function Help() {
  return (
    <div className="text">
      <p>In each of the stores, the employees create these &ldquo;local price reductions&rdquo; in the system when they see a soon-to-expire product and they get those &ldquo;yellow cloud&rdquo; price labels to put onto them.</p>
      <p>The employees type in how many e.g. cans of red kidney beans are about to expire, and they get a new barcode so the system can keep track of when they are sold.</p>
      <p>The system in the store sends all of these local price reductions to some larger system every ~15 minutes or so.Then some third system synchronizes from that system every ~1 hour or so.</p>
      <p>During this sync, only categories of products that are directly related to &ldquo;food&rdquo; get included, so that might account for some of the gap.</p>
      <p>This setup means there are a couple of possible ways that inaccurate data can creep in to the system compared to reality:</p>
      <ul>
        <li>The product isn&apos;t in a &ldquo;food category&rdquo;. If so, it will be in the store, but never in the system.</li>
        <li>The store employees register too many products. Maybe they have 1 expiring can of beans, but they type &ldquo;2&rdquo; into the system. The real can gets sold, but the system keeps insisting there is one more left.</li>
        <li>The store employees register too few products. Maybe they have 10 expiring cans of beans, but they type &ldquo;5&rdquo; into the system. The first 5 cans get sold, and now the remaining 5 in the store do not appear in the system.</li>
        <li>The delay of up to 1 hour means that local price reductions exist in the store that aren&apos;t in the system yet. Or vice versa, they are still present in the system, but they have already been sold in the store.</li>
        <li>Some times the product might be in the shopping basket of some other customer. If so, it will seem to be &ldquo;available&rdquo; in the system, but in reality it won&apos;t be to the next customer.</li>
      </ul>

      <p>If you find that your local Netto stores are consistently very far off the mark, it might be an issue with the process in the store, or with the synchronization system.</p>

      <p>Realistically, the numbers will never agree 100 %.They should be reasonably close under normal operations, though.</p>
    </div>
  )
}
