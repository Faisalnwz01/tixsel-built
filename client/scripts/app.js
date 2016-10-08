'use strict';
angular.module('main', [
    'ionic',
    'ngCordova',
    'ui.router',
    'ngMaterial',
    // TODO: load other modules selected during generation
  ])
  .config(function ($stateProvider, $urlRouterProvider) {

    // ROUTING with ui.router
    $urlRouterProvider.otherwise('/');
    $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
      .state('main', {
        url: '/main',
        template: '<ion-view view-title="main"></ion-view>',
        // templateUrl: 'main/templates/<someTemplate>.html',
        // controller: 'SomeCtrl as ctrl'
      })
      .state('home', {
        url: '/',
        templateUrl: 'main/templates/home.html',
        controller: 'HomeCtrl as ctrl'
      })
      .state('details', {
        url: '/details',
        params: {
          events: null
        },
        templateUrl: 'main/templates/details.html',
        controller: 'DetailsCtrl as ctrl',
        onEnter: function ($state, $stateParams) {
          if (!$stateParams.events) {
            // $state.go('home');
          }
        }
      });
  });

'use strict';
angular.module('main')
  .service('HotelService', function ($log, $http) {
    var Service = this,
      hotelSearchUrl = 'http://terminal2.expedia.com/x/mhotels/search?',
      hotelsPriceUrl = 'http://terminal2.expedia.com/x/mhotels/offers?';

    Service.searchForHotels = searchForHotels;
    Service.priceForHotels = priceForHotels;


    $log.log('Hello from your Service: HotelService in module main');

    function searchForHotels(location, checkInDate, checkOutDate) {
      var url = hotelSearchUrl + 'city=' + location + '&checkInDate=' + checkInDate + '&checkOutDate=' + checkOutDate + '&room1=2&apikey=BAGEROtURYYysKTHQIE7HK5m0tOFIjSH';
      return $http.get(url).then(function (data) {
        return data.data;
      });
    }

    function priceForHotels(hotelId, checkInDate, checkOutDate) {
      var url = hotelsPriceUrl + 'hotelId=' + hotelId + '&checkInDate=' + checkInDate + '&checkOutDate=' + checkOutDate + '&room1=2&apikey=BAGEROtURYYysKTHQIE7HK5m0tOFIjSH';
      return $http.get(url).then(function (data) {
        return data.data;
      });
    }

    return Service;

  });

'use strict';
angular.module('main')
  .service('FlightService', function ($log, $http) {
    var Service = this,
      flightsUrl = 'http://terminal2.expedia.com/x/mflights/search?';
    Service.searchForFlights = searchForFlights;
    Service.searchUSEventsWithKey = searchUSEventsWithKey;
    Service.lookUpAirportByLatLong = lookUpAirportByLatLong;
    Service.geocode = geocode;
    Service.airportCode = [{
      name: 'ABR'
    }, {
      name: 'ABI'
    }, {
      name: 'CAK'
    }, {
      name: 'ALS'
    }, {
      name: 'ABY'
    }, {
      name: 'ALB'
    }, {
      name: 'ABQ'
    }, {
      name: 'AEX'
    }, {
      name: 'ABE'
    }, {
      name: 'AIA'
    }, {
      name: 'APN'
    }, {
      name: 'AOO'
    }, {
      name: 'AMA'
    }, {
      name: 'ANC'
    }, {
      name: 'ATW'
    }, {
      name: 'AVL'
    }, {
      name: 'ASE'
    }, {
      name: 'AHN'
    }, {
      name: 'ATL'
    }, {
      name: 'ACY'
    }, {
      name: 'AGS'
    }, {
      name: 'AUG'
    }, {
      name: 'AUS'
    }, {
      name: 'BFL'
    }, {
      name: 'BWI'
    }, {
      name: 'BGR'
    }, {
      name: 'BHB'
    }, {
      name: 'BRW'
    }, {
      name: 'BTR'
    }, {
      name: 'BPT'
    }, {
      name: 'BKW'
    }, {
      name: 'BED'
    }, {
      name: 'BLI'
    }, {
      name: 'BJI'
    }, {
      name: 'BET'
    }, {
      name: 'BTT'
    }, {
      name: 'BIL'
    }, {
      name: 'BGM'
    }, {
      name: 'BHM'
    }, {
      name: 'BIS'
    }, {
      name: 'BMI'
    }, {
      name: 'BMG'
    }, {
      name: 'BLF'
    }, {
      name: 'BOI'
    }, {
      name: 'BOS'
    }, {
      name: 'BZN'
    }, {
      name: 'BKX'
    }, {
      name: 'BRO'
    }, {
      name: 'BQK'
    }, {
      name: 'BUF'
    }, {
      name: 'BUR'
    }, {
      name: 'BRL'
    }, {
      name: 'BBF'
    }, {
      name: 'BTV'
    }, {
      name: 'BTM'
    }, {
      name: 'CGI'
    }, {
      name: 'CLD'
    }, {
      name: 'CNM'
    }, {
      name: 'CPR'
    }, {
      name: 'CID'
    }, {
      name: 'CMI'
    }, {
      name: 'CHS'
    }, {
      name: 'CRW'
    }, {
      name: 'CLT'
    }, {
      name: 'CHO'
    }, {
      name: 'CHA'
    }, {
      name: 'CYS'
    }, {
      name: 'CHI'
    }, {
      name: 'MDW'
    }, {
      name: 'CHI'
    }, {
      name: 'ORD'
    }, {
      name: 'CIC'
    }, {
      name: 'CVG'
    }, {
      name: 'CKB'
    }, {
      name: 'CLE'
    }, {
      name: 'CVN'
    }, {
      name: 'COD'
    }, {
      name: 'CLL'
    }, {
      name: 'COS'
    }, {
      name: 'COU'
    }, {
      name: 'CAE'
    }, {
      name: 'CSG'
    }, {
      name: 'CLU'
    }, {
      name: 'GTR'
    }, {
      name: 'OLU'
    }, {
      name: 'CMH'
    }, {
      name: 'CDV'
    }, {
      name: 'CRP'
    }, {
      name: 'DAL'
    }, {
      name: 'DFW'
    }, {
      name: 'DAY'
    }, {
      name: 'DAB'
    }, {
      name: 'DEC'
    }, {
      name: 'DEN'
    }, {
      name: 'DSM'
    }, {
      name: 'DTW'
    }, {
      name: 'DTT'
    }, {
      name: 'DVL'
    }, {
      name: 'DIK'
    }, {
      name: 'DLG'
    }, {
      name: 'DDC'
    }, {
      name: 'DHN'
    }, {
      name: 'DUJ'
    }, {
      name: 'DBQ'
    }, {
      name: 'DLH'
    }, {
      name: 'DRO'
    }, {
      name: 'DUT'
    }, {
      name: 'EAU'
    }, {
      name: 'EEK'
    }, {
      name: 'IPL'
    }, {
      name: 'ELD'
    }, {
      name: 'ELP'
    }, {
      name: 'EKO'
    }, {
      name: 'ELM'
    }, {
      name: 'WDG'
    }, {
      name: 'ERI'
    }, {
      name: 'ESC'
    }, {
      name: 'EUG'
    }, {
      name: 'ACV'
    }, {
      name: 'EVV'
    }, {
      name: 'FAI'
    }, {
      name: 'FAR'
    }, {
      name: 'FMN'
    }, {
      name: 'XNA'
    }, {
      name: 'FAY'
    }, {
      name: 'FLG'
    }, {
      name: 'FNT'
    }, {
      name: 'FLO'
    }, {
      name: 'FOD'
    }, {
      name: 'FLL'
    }, {
      name: 'TBN'
    }, {
      name: 'RSW'
    }, {
      name: 'FSM'
    }, {
      name: 'VPS'
    }, {
      name: 'FWA'
    }, {
      name: 'FYU'
    }, {
      name: 'FAT'
    }, {
      name: 'GNV'
    }, {
      name: 'GCK'
    }, {
      name: 'GCC'
    }, {
      name: 'GDV'
    }, {
      name: 'GFK'
    }, {
      name: 'GRI'
    }, {
      name: 'GJT'
    }, {
      name: 'GRR'
    }, {
      name: 'GBD'
    }, {
      name: 'GTF'
    }, {
      name: 'GRB'
    }, {
      name: 'LWB'
    }, {
      name: 'GSO'
    }, {
      name: 'GLH'
    }, {
      name: 'PGV'
    }, {
      name: 'GSP'
    }, {
      name: 'GPT'
    }, {
      name: 'GUC'
    }, {
      name: 'HGR'
    }, {
      name: 'HNM'
    }, {
      name: 'CMX'
    }, {
      name: 'HRL'
    }, {
      name: 'MDT'
    }, {
      name: 'HRO'
    }, {
      name: 'BDL'
    }, {
      name: 'HVR'
    }, {
      name: 'HYS'
    }, {
      name: 'HLN'
    }, {
      name: 'HIB'
    }, {
      name: 'Big'
    }, {
      name: 'HHH'
    }, {
      name: 'HOB'
    }, {
      name: 'HOM'
    }, {
      name: 'HNL'
    }, {
      name: 'MKK'
    }, {
      name: 'EFD'
    }, {
      name: 'HOU'
    }, {
      name: 'IAH'
    }, {
      name: 'EFD'
    }, {
      name: 'HTS'
    }, {
      name: 'HSV'
    }, {
      name: 'HON'
    }, {
      name: 'HYA'
    }, {
      name: 'IDA'
    }, {
      name: 'IND'
    }, {
      name: 'INL'
    }, {
      name: 'IYK'
    }, {
      name: 'IMT'
    }, {
      name: 'IWD'
    }, {
      name: 'ISP'
    }, {
      name: 'ITH'
    }, {
      name: 'JAC'
    }, {
      name: 'JAN'
    }, {
      name: 'MKL'
    }, {
      name: 'JAX'
    }, {
      name: 'OAJ'
    }, {
      name: 'JMS'
    }, {
      name: 'JHW'
    }, {
      name: 'JST'
    }, {
      name: 'JPR'
    }, {
      name: 'JLN'
    }, {
      name: 'JNU'
    }, {
      name: 'OGG'
    }, {
      name: 'AZO'
    }, {
      name: 'LUP'
    }, {
      name: 'FCA'
    }, {
      name: 'MCI'
    }, {
      name: 'JHM'
    }, {
      name: 'EAR'
    }, {
      name: 'ENA'
    }, {
      name: 'KTM'
    }, {
      name: 'EYW'
    }, {
      name: 'GRK'
    }, {
      name: 'AKN'
    }, {
      name: 'IGM'
    }, {
      name: 'IRK'
    }, {
      name: 'LMT'
    }, {
      name: 'TYS'
    }, {
      name: 'ADQ'
    }, {
      name: 'LSE'
    }, {
      name: 'LFT'
    }, {
      name: 'LCH'
    }, {
      name: 'Hll'
    }, {
      name: 'LNY'
    }, {
      name: 'LNS'
    }, {
      name: 'LAN'
    }, {
      name: 'LAR'
    }, {
      name: 'LRD'
    }, {
      name: 'LRU'
    }, {
      name: 'LAS'
    }, {
      name: 'LBE'
    }, {
      name: 'PIB'
    }, {
      name: 'LAW'
    }, {
      name: 'LAB'
    }, {
      name: 'LWS'
    }, {
      name: 'LEW'
    }, {
      name: 'LWT'
    }, {
      name: 'LEX'
    }, {
      name: 'LBL'
    }, {
      name: 'LIH'
    }, {
      name: 'LNK'
    }, {
      name: 'LIT'
    }, {
      name: 'LGB'
    }, {
      name: 'GGG'
    }, {
      name: 'QLA'
    }, {
      name: 'SDF'
    }, {
      name: 'LBB'
    }, {
      name: 'LYH'
    }, {
      name: 'MCN'
    }, {
      name: 'MSN'
    }, {
      name: 'MHT'
    }, {
      name: 'MHK'
    }, {
      name: 'MBL'
    }, {
      name: 'MWA'
    }, {
      name: 'MQT'
    }, {
      name: 'MVY'
    }, {
      name: 'MCW'
    }, {
      name: 'MSS'
    }, {
      name: 'MFE'
    }, {
      name: 'MCK'
    }, {
      name: 'MFR'
    }, {
      name: 'MLB'
    }, {
      name: 'MEM'
    }, {
      name: 'MEI'
    }, {
      name: 'MIA'
    }, {
      name: 'MAF'
    }, {
      name: 'MLS'
    }, {
      name: 'MKE'
    }, {
      name: 'MSP'
    }, {
      name: 'MOT'
    }, {
      name: 'MSO'
    }, {
      name: 'MOB'
    }, {
      name: 'MOD'
    }, {
      name: 'MLI'
    }, {
      name: 'MLU'
    }, {
      name: 'MRY'
    }, {
      name: 'MGM'
    }, {
      name: 'MTJ'
    }, {
      name: 'MGW'
    }, {
      name: 'MWH'
    }, {
      name: 'MSL'
    }, {
      name: 'MKG'
    }, {
      name: 'MRY'
    }, {
      name: 'ACK'
    }, {
      name: 'ABF'
    }, {
      name: 'BNA'
    }, {
      name: 'EWN'
    }, {
      name: 'HVN'
    }, {
      name: 'MSY'
    }, {
      name: 'LGA'
    }, {
      name: 'JFK'
    }, {
      name: 'NYC'
    }, {
      name: 'EWR'
    }, {
      name: 'SWF'
    }, {
      name: 'PHF'
    }, {
      name: 'OME'
    }, {
      name: 'ORF'
    }, {
      name: 'OTH'
    }, {
      name: 'LBF'
    }, {
      name: 'OAK'
    }, {
      name: 'OGS'
    }, {
      name: 'OKC'
    }, {
      name: 'OMA'
    }, {
      name: 'ONT'
    }, {
      name: 'SNA'
    }, {
      name: 'MCO'
    }, {
      name: 'OSH'
    }, {
      name: 'OWB'
    }, {
      name: 'OXR'
    }, {
      name: 'PAH'
    }, {
      name: 'PGA'
    }, {
      name: 'PSP'
    }, {
      name: 'PFN'
    }, {
      name: 'PKB'
    }, {
      name: 'PSC'
    }, {
      name: 'PLN'
    }, {
      name: 'PDT'
    }, {
      name: 'PNS'
    }, {
      name: 'PIA'
    }, {
      name: 'PHL'
    }, {
      name: 'PHX'
    }, {
      name: 'PIR'
    }, {
      name: 'SOP'
    }, {
      name: 'PIT'
    }, {
      name: 'PIH'
    }, {
      name: 'PNC'
    }, {
      name: 'PWM'
    }, {
      name: 'PDX'
    }, {
      name: 'PSM'
    }, {
      name: 'PRC'
    }, {
      name: 'PQI'
    }, {
      name: 'PVD'
    }, {
      name: 'PVC'
    }, {
      name: 'PUB'
    }, {
      name: 'PUW'
    }, {
      name: 'UIN'
    }, {
      name: 'RDU'
    }, {
      name: 'RAP'
    }, {
      name: 'RDD'
    }, {
      name: 'RDM'
    }, {
      name: 'RNO'
    }, {
      name: 'RHI'
    }, {
      name: 'RIC'
    }, {
      name: 'RIW'
    }, {
      name: 'ROA'
    }, {
      name: 'RST'
    }, {
      name: 'ROC'
    }, {
      name: 'RKS'
    }, {
      name: 'RFD'
    }, {
      name: 'RKD'
    }, {
      name: 'ROW'
    }, {
      name: 'RUT'
    }, {
      name: 'SMF'
    }, {
      name: 'MBS'
    }, {
      name: 'SLN'
    }, {
      name: 'SPY'
    }, {
      name: 'SLC'
    }, {
      name: 'SJT'
    }, {
      name: 'SAT'
    }, {
      name: 'SAN'
    }, {
      name: 'QSF'
    }, {
      name: 'SFO'
    }, {
      name: 'SJC'
    }, {
      name: 'SBP'
    }, {
      name: 'SDP'
    }, {
      name: 'SBA'
    }, {
      name: 'SAF'
    }, {
      name: 'SMX'
    }, {
      name: 'STS'
    }, {
      name: 'SLK'
    }, {
      name: 'SRQ'
    }, {
      name: 'CIU'
    }, {
      name: 'SAV'
    }, {
      name: 'BFF'
    }, {
      name: 'SEA'
    }, {
      name: 'SHD'
    }, {
      name: 'SHR'
    }, {
      name: 'SHV'
    }, {
      name: 'SDY'
    }, {
      name: 'SVC'
    }, {
      name: 'SUX'
    }, {
      name: 'FSD'
    }, {
      name: 'SIT'
    }, {
      name: 'SGY'
    }, {
      name: 'SBN'
    }, {
      name: 'GEG'
    }, {
      name: 'SPI'
    }, {
      name: 'CEF'
    }, {
      name: 'SGF'
    }, {
      name: 'VSF'
    }, {
      name: 'STC'
    }, {
      name: 'SGU'
    }, {
      name: 'STL'
    }, {
      name: 'PIE'
    }, {
      name: 'SCE'
    }, {
      name: 'SBS'
    }, {
      name: 'SUN'
    }, {
      name: 'SRY'
    }, {
      name: 'TLH'
    }, {
      name: 'TPA'
    }, {
      name: 'TAX'
    }, {
      name: 'TXK'
    }, {
      name: 'TVF'
    }, {
      name: 'OOK'
    }, {
      name: 'TOL'
    }, {
      name: 'TOP'
    }, {
      name: 'TVC'
    }, {
      name: 'TTN'
    }, {
      name: 'TUS'
    }, {
      name: 'TUL'
    }, {
      name: 'TUP'
    }, {
      name: 'TWF'
    }, {
      name: 'TYR'
    }, {
      name: 'UNK'
    }, {
      name: 'EGE'
    }, {
      name: 'VDZ'
    }, {
      name: 'VLD'
    }, {
      name: 'VCT'
    }, {
      name: 'VIS'
    }, {
      name: 'ACT'
    }, {
      name: 'ALW'
    }, {
      name: 'DCA'
    }, {
      name: 'WAS'
    }, {
      name: 'IAD'
    }, {
      name: 'ALO'
    }, {
      name: 'ART'
    }, {
      name: 'ATY'
    }, {
      name: 'CWA'
    }, {
      name: 'EAT'
    }, {
      name: 'PBI'
    }, {
      name: 'WYS'
    }, {
      name: 'HPN'
    }, {
      name: 'SPS'
    }, {
      name: 'ICT'
    }, {
      name: 'AVP'
    }, {
      name: 'IPT'
    }, {
      name: 'ISN'
    }, {
      name: 'ILG'
    }, {
      name: 'ILM'
    }, {
      name: 'OLF'
    }, {
      name: 'WRL'
    }, {
      name: 'WRG'
    }, {
      name: 'YKM'
    }, {
      name: 'YAK'
    }, {
      name: 'YUM'
    }, {
      name: 'YXX'
    }, {
      name: 'YAA'
    }, {
      name: 'YEK'
    }, {
      name: 'YBG'
    }, {
      name: 'YYC'
    }, {
      name: 'YBL'
    }, {
      name: 'YGR'
    }, {
      name: 'YCG'
    }, {
      name: 'YYG'
    }, {
      name: 'YMT'
    }, {
      name: 'YYQ'
    }, {
      name: 'YXC'
    }, {
      name: 'YDF'
    }, {
      name: 'YHD'
    }, {
      name: 'YEG'
    }, {
      name: 'YEO'
    }, {
      name: 'YMM'
    }, {
      name: 'YYE'
    }, {
      name: 'YXJ'
    }, {
      name: 'YSM'
    }, {
      name: 'YFC'
    }, {
      name: 'YQX'
    }, {
      name: 'YGP'
    }, {
      name: 'YQU'
    }, {
      name: 'YHZ'
    }, {
      name: 'YHM'
    }, {
      name: 'YFB'
    }, {
      name: 'YKA'
    }, {
      name: 'YLW'
    }, {
      name: 'YQK'
    }, {
      name: 'YGK'
    }, {
      name: 'YQL'
    }, {
      name: 'YXU'
    }, {
      name: 'YXH'
    }, {
      name: 'YQM'
    }, {
      name: 'YYY'
    }, {
      name: 'YMQ'
    }, {
      name: 'YUL'
    }, {
      name: 'YCD'
    }, {
      name: 'YYB'
    }, {
      name: 'YOW'
    }, {
      name: 'YYF'
    }, {
      name: 'YZT'
    }, {
      name: 'YPW'
    }, {
      name: 'YPR'
    }, {
      name: 'YQB'
    }, {
      name: 'YQZ'
    }, {
      name: 'YRT'
    }, {
      name: 'YRL'
    }, {
      name: 'YQR'
    }, {
      name: 'YRJ'
    }, {
      name: 'YUY'
    }, {
      name: 'YSJ'
    }, {
      name: 'YZP'
    }, {
      name: 'YZR'
    }, {
      name: 'YXE'
    }, {
      name: 'YAM'
    }, {
      name: 'YZV'
    }, {
      name: 'YXL'
    }, {
      name: 'YYD'
    }, {
      name: 'YYT'
    }, {
      name: 'YSB'
    }, {
      name: 'YQY'
    }, {
      name: 'YXT'
    }, {
      name: 'YTH'
    }, {
      name: 'YQT'
    }, {
      name: 'YTS'
    }, {
      name: 'YYZ'
    }, {
      name: 'YTO'
    }, {
      name: 'YTZ'
    }, {
      name: 'YVO'
    }, {
      name: 'YVR'
    }, {
      name: 'YYJ'
    }, {
      name: 'YWK'
    }, {
      name: 'YXY'
    }, {
      name: 'YWL'
    }, {
      name: 'YQG'
    }, {
      name: 'YWG'
    }, {
      name: 'YZF'
    }, {
      name: 'LAX'
    }];

    $log.log('Hello from your Service: FlightService in module main');

    function searchForFlights(departureAirport, arrivalAirport, date) {
      var url = flightsUrl + 'departureAirport=' + departureAirport + '&arrivalAirport=' + arrivalAirport + '&departureDate=' + date + '&apikey=BAGEROtURYYysKTHQIE7HK5m0tOFIjSH';
      return $http.get(url).then(function (data) {
        return data.data;
      });
    }

    function searchUSEventsWithKey(key) {
      var eventUrsl = 'http://app.ticketmaster.com/discovery/v2/events.json?keyword=' + key + '&countryCode=US&apikey=g4sXxf0ioySFxO0FQFYnGMEoAwW1uMoQ';
      return $http.get(eventUrsl).then(function (data) {
        if (data.data._embedded) {
          return data.data._embedded.events;
        } else {
          return [];
        }
      });
    }

    function lookUpAirportByLatLong(lat, long) {
      var airportLookupUrl = 'http://terminal2.expedia.com/x/geo/features?within=30km&lat=' + lat + '&lng=' + long + '&type=airport&verbose=3&apikey=BAGEROtURYYysKTHQIE7HK5m0tOFIjSH';
      return $http.get(airportLookupUrl).then(function (data) {
        return data.data;
      });
    }

    function geocode(address) {
      var geocodeUrl = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + address;
      return $http.get(geocodeUrl).then(function (data) {
        return data.data;
      });
    }

    return Service;

  });
'use strict';
angular.module('main')
  .service('EventService', function ($log, $http) {
    var Service = this;
    Service.getUSEvents = getUSEvents;
    Service.searchUSEventsWithKey = searchUSEventsWithKey;
    Service.getEventDetailById = getEventDetailById;
    Service.events = [];
    $log.log('Hello from your Service: EventService in module main');

    return Service;

    function getUSEvents() {
      var eventUrsl = 'http://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=g4sXxf0ioySFxO0FQFYnGMEoAwW1uMoQ';
      return $http.get(eventUrsl).then(function (data) {
        return data.data;
      });
    }

    function searchUSEventsWithKey(key) {
      var eventUrsl = 'http://app.ticketmaster.com/discovery/v2/events.json?keyword=' + key + '&countryCode=US&apikey=g4sXxf0ioySFxO0FQFYnGMEoAwW1uMoQ';
      return $http.get(eventUrsl).then(function (data) {
        if (data.data._embedded) {
          return data.data._embedded.events;
        } else {
          return [];
        }
      });
    }

    function getEventDetailById(id) {
      var eventUrsl = 'http://app.ticketmaster.com/discovery/v2/events/' + id + '.json?apikey=g4sXxf0ioySFxO0FQFYnGMEoAwW1uMoQ';
      return $http.get(eventUrsl).then(function (data) {
        if (data.data._embedded) {
          return data.data;
        } else {
          return [];
        }
      });
    }

  });

'use strict';
angular.module('main')
.directive('navbar', function () {
  return {
    templateUrl: 'main/templates/navbar.html',
    restrict: 'E',
    link: function postLink () {
    }
  };
});

'use strict';
(function () {
  /** add it to the application */
  angular.module('main')
    .directive('eventSearchTypeahead', EventSearchTypeahead)
    .controller('EventSearchTypeaheadCtrl', EventSearchTypeaheadCtrl);

  /**
   * Create directive
   *
   * @returns {{restrict: string, replace: boolean, scope: {}, templateUrl: string, bindToController: boolean}}
   */
  function EventSearchTypeahead() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        selectedEvent: '=',
        selectedArr: '='
      },
      controller: 'EventSearchTypeaheadCtrl',
      controllerAs: 'ctrl',
      bindToController: true,
      templateUrl: 'main/templates/event-search-typeahead.html'
    };
  }

  function EventSearchTypeaheadCtrl($timeout, $q, $log, EventService, FlightService) {
    var self = this;
    self.simulateQuery = true;
    self.isDisabled = false;

    self.events = loadAll();
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for events... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {
      var results = query ? self.events.filter(createFilterFor(query)) : EventService.events,
        deferred;
      if (self.simulateQuery && results.length === 0) {
        deferred = $q.defer();
        EventService.searchUSEventsWithKey(query).then(function (res) {
          $log.log(res);
          self.selectedArr = res;
          if (res.length > 0) {
            self.events = res;
            addValue(self.events);
            deferred.resolve(res);
          } else {
            return [];
          }
        });
        return deferred.promise;
      } else {
        self.selectedArr = results;
        return results;
      }
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      EventService.getEventDetailById(item.id).then(function (evt) {
        if (!evt._embedded.venues[0].location) {
          FlightService.geocode(evt._embedded.venues['0'].address.line1 + ' ' + evt._embedded.venues['0'].city.name).then(function (loc) {
            evt._embedded.venues[0].location = {
              latitude: loc.results['0'].geometry.location.lat,
              longitude: loc.results['0'].geometry.location.lng
            };
            self.selectedEvent = evt;
          });
        } else {
          self.selectedEvent = evt;
        }
      });
    }

    /**
     * Build `components` list of key/value pairs
     */
    function loadAll() {
      var events = EventService.events;
      return addValue(events);
    }

    function addValue(events) {
      return events.map(function (ev) {
        ev.value = ev.name.toLowerCase();
        return ev;
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };

    }
  }
})();

'use strict';
(function () {
  /** add it to the application */
  angular.module('main')
    .controller('airportAutocompleteCtrl', airportAutocompleteCtrl)
    .directive('airportAutocomplete', airportAutocomplete);

  function airportAutocomplete() {
    return {
      templateUrl: 'main/templates/airport-autocomplete.html',
      restrict: 'E',
      replace: true,
      scope: {
        selectedAirport: '=',
        placeholder: '@',
        required: '='
      },
      controller: 'airportAutocompleteCtrl',
      controllerAs: 'ctrl',
      bindToController: true,
    };
  }

  function airportAutocompleteCtrl(FlightService) {
    var self = this;
    self.simulateQuery = true;
    self.isDisabled = false;

    self.events = loadAll();
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for events... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {
      var results = query ? self.events.filter(createFilterFor(query)) : FlightService.airportCode;
      // if (self.simulateQuery && results.length === 0) {
      return results;
      // }
    }

    function searchTextChange() {}

    function selectedItemChange(item) {
      self.selectedAirport = item;
    }

    /**
     * Build `components` list of key/value pairs
     */
    function loadAll() {
      var airports = FlightService.airportCode;
      return addValue(airports);
    }

    function addValue(airports) {
      return airports.map(function (ev) {
        ev.value = ev.name.toLowerCase();
        return ev;
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };

    }

  }
})();
'use strict';
angular.module('main')
.controller('UserCtrl', function (
  $log,
  $ionicAuth
) {

  this.user = {
    email: '',
    password: ''
  };
  this.updateResult = function (type, result) {
    $log.log(type, result);
    this.user.resultType = type;
    this.user.result = result;
  };

  var responseCB = function (response) {
    this.updateResult('Response', response);
  }.bind(this);

  var rejectionCB = function (rejection) {
    this.updateResult('Rejection', rejection);
  }.bind(this);

  // tries to sign the user up and displays the result in the UI
  this.signup = function () {
    $ionicAuth.signup(this.user)
    .then(responseCB)
    .catch(rejectionCB);
  };
  // tries to sign in the user and displays the result in the UI
  this.signin = function () {
    $ionicAuth.login('basic', this.user)
    .then(responseCB)
    .catch(rejectionCB);
  };
});

'use strict';
angular.module('main')
  .controller('HomeCtrl', function ($log, $scope, FlightService, HotelService, $state) {
    var self = this;
    self.selectedDepartureChange = selectedDepartureChange;
    self.searchForFlights = searchForFlights;

    $log.log('Hello from your Controller: HomeCtrl in module main:. This is your controller:', this);

    self.airportCode = FlightService.airportCode;
    self.selectedEvent = {
      numOfAttendees: '1 Room, 2 Attendees',
      servicesType: '3'
    };
    self.selectedEventIte = {};

    $scope.$watch(function () {
      return self.selectedEvent.eventSearch;
    }, function (current) {
      if (!current) {
        return;
      }
      self.selectedEvent.checkin = new Date(subtractkDays(current.dates.start.localDate, 1));
      self.selectedEvent.checkout = current.dates.end ? new Date(addDays(current.dates.start.localDate, 2)) : new Date(addDays(current.dates.start.localDate, 2));
    });

    function selectedDepartureChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    function searchForFlights(selectedEvent) {
      $log.info(selectedEvent);
      $state.go('details', {
        events: selectedEvent
      });
      selectedEventChange(selectedEvent);
    }

    function selectedEventChange(item) {
      $log.log(item);
      var eventStartDate,
        eventEndDate;
      self.selectedEventIte = {
        flights: [],
        hotels: []
      };
      eventStartDate = format(item.checkin);
      eventEndDate = format(item.checkout);

      HotelService.searchForHotels(item.eventSearch._embedded.venues['0'].location.latitude + ',' + item.eventSearch._embedded.venues['0'].location.longitude, eventStartDate, eventEndDate)
        .then(function (searchHotel) {
          //.hotelList
          searchHotel.hotelList.forEach(function (hotel) {
            HotelService.priceForHotels(hotel.hotelId, eventStartDate, eventEndDate)
              .then(function (hotelWithPrice) {
                self.selectedEventIte.hotels.push(hotelWithPrice);
              });
          });
        });
      FlightService.lookUpAirportByLatLong(item.eventSearch._embedded.venues['0'].location.latitude, item.eventSearch._embedded.venues['0'].location.longitude)
        .then(function (airport) {
          FlightService.searchForFlights(item.departureAirport, airport[0].tags.iata.airportCode.value, eventStartDate)
            .then(function (flights) {
              self.selectedEventIte.flights = flights;
              $log.log(flights, 'here are the flights we can take');
            });
        });
    }

    function format(date) {
      var newDate = moment(date, 'YYYY-MM-DD'); // eslint-disable-line no-undef
      var day = newDate.format('DD');
      var month = newDate.format('MM');
      var year = newDate.format('YYYY');
      return year + '-' + month + '-' + day;
    }

    function subtractkDays(date, num) {
      return format(moment(date, 'YYYY-MM-DD').subtract(num, 'days')); // eslint-disable-line no-undef
    }

    function addDays(date, num) {
      return format(moment(date, 'YYYY-MM-DD').add(num, 'days')); // eslint-disable-line no-undef
    }

  });

'use strict';
angular.module('main')
  .controller('DetailsCtrl', function ($log, $stateParams) {
    var self = this;
    $log.log('Hello from your Controller: DetailsCtrl in module main:. This is your controller:', this);

    self.event = $stateParams.events;
    $log.log($stateParams.events);
    self.backgroundImgUrl = _.maxBy(self.event.eventSearch.images, 'width');
    self.overViewImgUrl = _.filter(self.event.eventSearch.images, {'ratio': '3_2'});

  });


'use strict';
angular.module('EventIx', [
  // load your modules here
  'main', // starting with the main module
]);
