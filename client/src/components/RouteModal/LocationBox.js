import '../../styles/RouteLocationBox.css'

export default function LocationBox(props){

    return (
        <div className={`routeLocationBox ${props.active ? 'active': ''}`}>
            <p className="box-header">{props.sequence}</p>
            <div className="dotted-line"></div>
            {props.locationName !=='' && <p className="box-content-locationName">{props.locationName}</p>}
            <p className="box-content">{props.address}</p>  
        </div>
    )
}