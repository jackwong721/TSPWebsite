import React, {useContext} from 'react';
import { LocationContext } from '../store/locations-context';


export default function HistoryButton(props) {
  const LocationCtx = useContext(LocationContext)

  return (
    <div onClick={LocationCtx.toggleHistoryModal}>
      HISTORY
    </div>
  );
}

