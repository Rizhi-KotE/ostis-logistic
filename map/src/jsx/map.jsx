import createClass from "create-react-class"
import PropTypes from "prop-types"
import L from "leaflet"
import {MapUtils} from "../utils"
import React from "react"
import _ from "underscore"
import {cities} from "../data";
import mapCss from "../../static/components/css/map.css"

export class Map extends React.Component {
    static propTypes: {
        objects: PropTypes.array.isRequired,
    };

    static defaultProps: {
        objects: []
    };

    createMap() {
        this.map = new L.Map('map', {zoomControl: false});
        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 17});
        this.map.addLayer(osm);
    }

    _bindMarkersToContextMenu(markers, sc_addrs) {
        const marker2address = _.zip(markers, sc_addrs);
        const filtered = _.filter(marker2address, _.property(1))
        filtered.forEach(([marker, scAddress]) => marker.getElement().setAttribute("sc_addr", scAddress))
    }

    addMarkersToMap() {
        let notEmptyObjects = this.props.objects;
        let markers = _.forEach(notEmptyObjects, (obj) => L.geoJson(obj.geojson));
        markers = _.map(markers, marker => L.marker(marker.coordinates, marker));
        let markersGroup = L.featureGroup(markers)
            .on("add", () => this._bindMarkersToContextMenu(markers, notEmptyObjects.map(_.property("scAddress"))))
            .addTo(this.map);
        markers.length && this.map.fitBounds(markersGroup.getBounds());
    }


    componentDidMount() {
        this.createMap();
        this.addMarkersToMap();
    }

    componentDidUpdate() {
        this.addMarkersToMap();
    }

    render() {
        return (
            <div id="map" ref="map" style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "100%",
                height: "100%",
                zIndex: 0
            }}/>
        );
    }
}