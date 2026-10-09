// Set to true once project photos are uploaded. Cards that have a non-empty photos array will then display the before/after slider.
const SHOW_PROJECT_PHOTOS = false;

const projectsData = [
  {
    "name": "Common Area Renovations, Floors 2-5",
    "locations": [
      "5550 Friendship Boulevard, Chevy Chase, MD 20815"
    ],
    "architect": "Balodemas Architects",
    "category": "Building Renovations",
    "featured": true,
    "photos": []
  },
  {
    "name": "Tysons Pond: Main Lobby and Restroom Renovations",
    "locations": [
      "1600 Spring Hill Road, Vienna, VA 22182"
    ],
    "architect": "The M Group",
    "category": "Building Renovations",
    "featured": true,
    "photos": []
  },
  {
    "name": "Main Lobby Renovation",
    "locations": [
      "14040 Park Center Road, Herndon, VA 20171"
    ],
    "architect": "Fox Architect",
    "category": "Building Renovations",
    "featured": true,
    "photos": []
  },
  {
    "name": "4th Floor Demolition and Lobby Renovations",
    "locations": [
      "8609 Westwood Center Drive, Vienna, VA 22182"
    ],
    "architect": "Intec Group",
    "category": "Building Renovations",
    "featured": true,
    "photos": []
  },
  {
    "name": "Lobby & Marketing Center",
    "locations": [
      "8609 Westwood Center Drive, Vienna, VA 22182"
    ],
    "architect": "Intec Group",
    "category": "Building Renovations",
    "featured": true,
    "photos": []
  },
  {
    "name": "7th Floor Renovation",
    "locations": [
      "12975 Worldgate Drive, Herndon, VA 20170"
    ],
    "architect": "LDG Architecture & Design",
    "category": "Building Renovations",
    "featured": true,
    "photos": []
  },
  {
    "name": "2nd Floor Demolition and Corridor",
    "locations": [
      "6359 Walker Lane, Alexandria, VA 22310"
    ],
    "architect": "Atelier Architects",
    "category": "Building Renovations",
    "featured": true,
    "photos": []
  },
  {
    "name": "CBRE Management Office",
    "locations": [
      "1100 North Glebe Road, Arlington, VA 22201"
    ],
    "architect": "Focus Architecture",
    "category": "Office Interiors",
    "featured": true,
    "photos": []
  },
  {
    "name": "Highmark: LEED Buildout",
    "locations": [
      "4100 North Fairfax Drive, Arlington, VA 22203"
    ],
    "architect": "GTM Architects",
    "category": "Office Interiors",
    "featured": true,
    "photos": []
  },
  {
    "name": "Fidelity Bank",
    "locations": [
      "3110 Fairview Park Drive, Falls Church, VA 22042"
    ],
    "architect": "GTM Architects",
    "category": "Office Interiors",
    "featured": true,
    "photos": []
  },
  {
    "name": "Credence Management Solutions",
    "locations": [
      "8609 Westwood Center Drive, Vienna, VA 22182"
    ],
    "architect": "DBI",
    "category": "Office Interiors",
    "featured": true,
    "photos": []
  },
  {
    "name": "Reed Integration",
    "locations": [
      "6359 Walker Lane, Alexandria, VA 22310"
    ],
    "architect": "Atelier Architects",
    "category": "Office Interiors",
    "featured": true,
    "photos": []
  },
  {
    "name": "XScion",
    "locations": [
      "1420 Spring Hill Road, McLean, VA 22182"
    ],
    "architect": "DBI",
    "category": "Office Interiors",
    "featured": true,
    "photos": []
  },
  {
    "name": "Marashlain & Donahue",
    "locations": [
      "1420 Spring Hill Road, McLean, VA 22102"
    ],
    "architect": "Little Diversified Architectural Consulting",
    "category": "Office Interiors",
    "featured": true,
    "photos": []
  },
  {
    "name": "CTIC",
    "locations": [
      "45195 Business Court, Dulles, VA 20166"
    ],
    "architect": "Hickok Cole",
    "category": "Office Interiors",
    "featured": true,
    "photos": []
  },
  {
    "name": "Suntiva Expansion",
    "locations": [
      "7600 Leesburg Pike, Falls Church, VA 22043"
    ],
    "architect": "GTM Architects",
    "category": "Office Interiors",
    "featured": true,
    "photos": []
  },
  {
    "name": "Mooring Financial",
    "locations": [
      "8609 Westwood Center Drive, Vienna, VA 22182"
    ],
    "architect": "Intec Group",
    "category": "Office Interiors",
    "featured": true,
    "photos": []
  },
  {
    "name": "NET IQ",
    "locations": [
      "8609 Westwood Center Drive, Vienna, VA 22182"
    ],
    "architect": "Intec Group",
    "category": "Office Interiors",
    "featured": true,
    "photos": []
  },
  {
    "name": "Sotera Defense Solutions",
    "locations": [
      "Arlington, VA"
    ],
    "architect": "Form Architects",
    "category": "Office Interiors",
    "featured": true,
    "photos": []
  },
  {
    "name": "D'Orazio Expansion",
    "locations": [
      "7600 Leesburg Pike, Falls Church, VA 22043"
    ],
    "architect": "GTM Architects",
    "category": "Office Interiors",
    "featured": false,
    "photos": []
  },
  {
    "name": "Blue Ally",
    "locations": [
      "8609 Westwood Center Drive, Vienna, VA 22182"
    ],
    "architect": "Intec Group",
    "category": "Office Interiors",
    "featured": false,
    "photos": []
  },
  {
    "name": "MTAG Services",
    "locations": [
      "8609 Westwood Center Drive, Vienna, VA 22182"
    ],
    "architect": "Intec Group",
    "category": "Office Interiors",
    "featured": false,
    "photos": []
  },
  {
    "name": "JDM Title",
    "locations": [
      "1577 Spring Hill Road, Vienna, VA 22182"
    ],
    "architect": "Collective Architecture",
    "category": "Office Interiors",
    "featured": false,
    "photos": []
  },
  {
    "name": "Public Relay",
    "locations": [
      "8500 Leesburg Pike, Vienna, VA 22182"
    ],
    "architect": null,
    "category": "Office Interiors",
    "featured": false,
    "photos": []
  },
  {
    "name": "ITT Corporation",
    "locations": [
      "600 Maryland Avenue, SW, Washington, DC 20024"
    ],
    "architect": null,
    "category": "Office Interiors",
    "featured": false,
    "photos": []
  },
  {
    "name": "Spec Suite",
    "locations": [
      "45055 Underwood Lane, Dulles, VA 20166"
    ],
    "architect": "Hofmann Associates",
    "category": "Office Interiors",
    "featured": false,
    "photos": []
  },
  {
    "name": "Department of Homeland Security",
    "locations": [
      "1616 North Fort Meyer Drive, Arlington, VA 22209"
    ],
    "architect": "M Group",
    "category": "Office Interiors",
    "featured": false,
    "photos": []
  },
  {
    "name": "The Neurology Center: Four Locations",
    "locations": [
      "5454 Wisconsin Avenue, Chevy Chase, MD 20815",
      "8555 16th Street, Silver Spring, MD 20910",
      "1201 Seven Locks Road, Rockville, MD 20854",
      "2141 K Street, NW, Washington, DC 20037"
    ],
    "architect": "GTM Architects",
    "category": "Medical Offices",
    "featured": true,
    "photos": []
  },
  {
    "name": "Autopart International: Ground Floor Renovation",
    "locations": [
      "14970 Farm Creek Drive, Woodbridge, VA 22191"
    ],
    "architect": "Intec Group",
    "category": "Industrial & Warehouse",
    "featured": true,
    "photos": []
  },
  {
    "name": "Air Cartage",
    "locations": [
      "45190 Prologis Plaza, Dulles, VA 20166"
    ],
    "architect": "Hofmann Associates",
    "category": "Industrial & Warehouse",
    "featured": true,
    "photos": []
  },
  {
    "name": "Signs by Tomorrow & Georgetown Cupcake",
    "locations": [
      "45449 Severn Way, Sterling, VA 20166"
    ],
    "architect": "RJS and Associates",
    "category": "Retail",
    "featured": true,
    "photos": []
  },
  {
    "name": "Closet Factory",
    "locations": [
      "8500 Leesburg Pike, Vienna, VA 22182"
    ],
    "architect": null,
    "category": "Retail",
    "featured": true,
    "photos": []
  },
  {
    "name": "Saint Anselm's Abbey School: Biology Lab Renovations",
    "locations": [
      "4501 South Dakota Avenue, NE, Washington, DC 20017"
    ],
    "architect": null,
    "category": "Education & Institutional",
    "featured": true,
    "photos": []
  }
];
