export default function getLocation() {
    const successLoc = (setLat: any, setLong: any, setTime: any) => (pos: GeolocationPosition) => {
        console.log(pos);
        setLat(pos.coords.latitude);
        setLong(pos.coords.longitude);
        setTime(pos.timestamp);
    }
    const failureLoc = (err: GeolocationPositionError) => {
        console.log(err);
    }

    
    
}