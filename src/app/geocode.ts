export interface Geocode {
    spatialReference: SpatialReference;
    candidates: Candidate[];
}

export interface SpatialReference {
    wkid: number;
    latestWkid: number;
}

export interface Location {
    x: number;
    y: number;
}

export interface Attributes {
    Loc_name: string;
    Score: number;
    Match_addr: string;
    Addr_type: string;
    AddNum: string;
    Side: string;
    StPreDir: string;
    StPreType: string;
    StName: string;
    StType: string;
    StDir: string;
    StAddr: string;
    City: string;
    County: string;
    State: string;
    StateAbbr: string;
    ZIP: string;
    DisplayX: number;
    DisplayY: number;
    Xmin?: number;
    Xmax?: number;
    Ymin?: number;
    Ymax?: number;
    AddNumFrom: string;
    AddNumTo: string;
    Country: string;
    LangCode: string;
    Distance: string;
}

export interface Extent {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
}

export interface Candidate {
    address: string;
    location: Location;
    score: number;
    attributes: Attributes;
    extent: Extent;
}