import { Marker } from "react-leaflet";
import { Icon } from "leaflet";

// see https://vitejs.dev/guide/assets.html#static-asset-handling
import bilkaIcon from '../assets/images/bilka.png'
import føtexIcon from '../assets/images/føtex.png'
import nettoIcon from '../assets/images/netto.png'

const ICON_SIZE = [50, 50];
const ICONS = {
  bilka: new Icon({ iconUrl: bilkaIcon, iconSize: ICON_SIZE }),
  foetex: new Icon({ iconUrl: føtexIcon, iconSize: ICON_SIZE }),
  netto: new Icon({ iconUrl: nettoIcon, iconSize: ICON_SIZE }),
};

/**
 * Just like a regular <Marker />
 * but takes a brand prop that translates to the right icon
 */
export default function MapBrandMarker(props) {
  return (
    <Marker
      icon={ICONS[props.brand]}
      {...props}
    />
  );
}
