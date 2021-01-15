export default {
  isLoading: false,
  wargameList: [
    {
      name: 'http://localhost:8080/db/wargame-keeemiss',
      title: 'Task Group-Initialised',
      initiated: true
    },
    {
      name: 'http://localhost:8080/db/wargame-kbrx8jmy',
      title: 'IMWARC-New Task Group',
      initiated: false
    },
    {
      name: 'http://localhost:8080/db/wargame-kaf9gvb3',
      title: 'IMWARC-NewMap',
      initiated: true
    },
    {
      name: 'http://localhost:8080/db/wargame-k5xyxas9',
      title: 'IMWARC-T2 Playing',
      initiated: true
    },
    {
      name: 'http://localhost:8080/db/wargame-k5xxsr4b',
      title: 'IMWARC-T1 Adjudication',
      initiated: true
    },
    {
      name: 'http://localhost:8080/db/wargame-k5pap52f',
      title: 'IMWARC-Initialised',
      initiated: true
    },
    {
      name: 'http://localhost:8080/db/wargame-k5pafxci',
      title: 'IMWARC',
      initiated: false
    },
    {
      name: 'http://localhost:8080/db/wargame-k16fadm4',
      title: 'Monday',
      initiated: true
    }
  ],
  currentWargame: 'wargame-kaf9gvb3',
  exportMessagelist: [],
  wargameTitle: 'IMWARC-NewMap',
  data: {
    channels: {
      channels: [
        {
          name: 'Channel 16',
          participants: [
            {
              force: 'White',
              forceUniqid: 'umpire',
              icon: 'images/default_img/umpireDefault.png',
              roles: [],
              subscriptionId: 'k63pjpfv',
              templates: []
            },
            {
              force: 'Red',
              forceUniqid: 'Red',
              icon: 'images/default_img/umpireDefault.png',
              roles: [],
              subscriptionId: 'k63pjsbv',
              templates: []
            },
            {
              force: 'Blue',
              forceUniqid: 'Blue',
              icon: 'images/default_img/umpireDefault.png',
              roles: [],
              subscriptionId: 'k63pju7l',
              templates: []
            }
          ],
          uniqid: 'channel-k63pjit0'
        },
        {
          name: 'Blue Net',
          participants: [
            {
              force: 'White',
              forceUniqid: 'umpire',
              icon: 'images/default_img/umpireDefault.png',
              roles: [],
              subscriptionId: 'k63pk0d3',
              templates: []
            },
            {
              force: 'Blue',
              forceUniqid: 'Blue',
              icon: 'images/default_img/umpireDefault.png',
              roles: [],
              subscriptionId: 'k63pk2o6',
              templates: []
            }
          ],
          uniqid: 'channel-k63pjvpb'
        },
        {
          name: 'Mapping',
          participants: [
            {
              force: 'White',
              forceUniqid: 'umpire',
              icon: 'images/default_img/umpireDefault.png',
              roles: [],
              subscriptionId: 'k53tifeo',
              templates: []
            },
            {
              force: 'Blue',
              forceUniqid: 'Blue',
              icon: 'images/default_img/umpireDefault.png',
              roles: [],
              subscriptionId: 'k53tij98',
              templates: []
            },
            {
              force: 'Red',
              forceUniqid: 'Red',
              icon: 'images/default_img/umpireDefault.png',
              roles: [],
              subscriptionId: 'k53tiqdf',
              templates: []
            },
            {
              force: 'Green',
              forceUniqid: 'Green',
              icon: 'images/default_img/umpireDefault.png',
              roles: [],
              subscriptionId: 'k53tivj5',
              templates: []
            }
          ],
          uniqid: 'channel-k53ti36p'
        }
      ],
      complete: false,
      dirty: false,
      name: 'Channels',
      selectedChannel: ''
    },
    forces: {
      complete: true,
      dirty: false,
      forces: [
        {
          color: '#FCFBEE',
          dirty: false,
          icon: 'images/default_img/umpireDefault.png',
          name: 'White',
          overview: 'Umpire force.',
          roles: [
            {
              isGameControl: true,
              isInsightViewer: true,
              isObserver: true,
              name: 'Game Control',
              password: 'p2311',
              canSubmitPlans: false
            }
          ],
          umpire: true,
          uniqid: 'umpire'
        },
        {
          assets: [
            {
              condition: 'Full capability',
              contactId: 'C043',
              history: [
                {
                  position: 'P21',
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 2
                }
              ],
              name: 'Frigate',
              perceptions: [
                {
                  by: 'Red',
                  force: 'Blue',
                  name: 'NORT',
                  type: 'frigate'
                }
              ],
              plannedTurns: [
                {
                  route: [
                    'Q21',
                    'Q20'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 4
                },
                {
                  route: [
                    'R19',
                    'S19'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 5
                }
              ],
              platformType: 'frigate',
              position: 'P21',
              status: {
                speedKts: 20,
                state: 'Transiting'
              },
              uniqid: 'a0pra00001'
            },
            {
              condition: 'Full capability',
              contactId: 'C072',
              history: [
                {
                  position: 'C17',
                  status: {
                    state: 'Landed'
                  },
                  turn: 2
                }
              ],
              name: 'MPA',
              perceptions: [],
              plannedTurns: [],
              platformType: 'fixed-wing-aircraft',
              position: 'C17',
              status: {
                state: 'Landed'
              },
              uniqid: 'a0pra00002'
            },
            {
              condition: 'Full capability',
              contactId: 'C012',
              history: [
                {
                  position: 'S23',
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 2
                }
              ],
              name: 'Tanker',
              perceptions: [
                {
                  by: 'Red',
                  force: 'Blue',
                  type: ''
                }
              ],
              plannedTurns: [
                {
                  route: [
                    'O20',
                    'O19'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 4
                },
                {
                  route: [
                    'O18',
                    'O17'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 5
                },
                {
                  route: [
                    'N16',
                    'M16'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 6
                }
              ],
              platformType: 'merchant-vessel',
              position: 'O21',
              route: [
                'P21',
                'O21'
              ],
              status: {
                speedKts: 20,
                state: 'Transiting'
              },
              uniqid: 'a0pra00003'
            }
          ],
          color: '#00F',
          dirty: false,
          icon: 'images/default_img/umpireDefault.png',
          name: 'Blue',
          overview: 'Blue force.',
          roles: [
            {
              isGameControl: false,
              isInsightViewer: false,
              isObserver: false,
              name: 'CO',
              password: 'p5543',
              canSubmitPlans: false
            },
            {
              isGameControl: false,
              isInsightViewer: false,
              isObserver: false,
              name: 'Comms',
              password: 'p5143',
              canSubmitPlans: false
            }
          ],
          umpire: false,
          uniqid: 'Blue'
        },
        {
          assets: [
            {
              condition: 'Full capability',
              contactId: 'C065',
              history: [
                {
                  position: 'N04',
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 2
                }
              ],
              locationPending: true,
              name: 'Dhow-A',
              perceptions: [
                {
                  by: 'Blue',
                  force: 'Green',
                  type: ''
                }
              ],
              plannedTurns: [
                {
                  route: [
                    'L04'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 3
                },
                {
                  route: [
                    'K05'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 4
                },
                {
                  route: [
                    'J05'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 5
                }
              ],
              platformType: 'fishing-vessel',
              position: 'M04',
              route: [
                'M04'
              ],
              status: {
                speedKts: 10,
                state: 'Transiting'
              },
              uniqid: 'a0pra000100'
            },
            {
              condition: 'Full capability',
              contactId: 'C105',
              history: [
                {
                  position: 'N10',
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 2
                }
              ],
              locationPending: true,
              name: 'Dhow-B',
              perceptions: [
                {
                  by: 'Blue',
                  force: 'Green',
                  name: 'SHU’AI',
                  type: 'fishing-vessel'
                }
              ],
              plannedTurns: [
                {
                  route: [
                    'L09'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 3
                },
                {
                  status: {
                    state: 'Fishing'
                  },
                  turn: 4
                },
                {
                  status: {
                    state: 'Fishing'
                  },
                  turn: 5
                },
                {
                  route: [
                    'K09'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 6
                },
                {
                  route: [
                    'J09'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 7
                }
              ],
              platformType: 'fishing-vessel',
              position: 'M10',
              route: [
                'M10'
              ],
              status: {
                speedKts: 10,
                state: 'Transiting'
              },
              uniqid: 'a0pra000101'
            },
            {
              condition: 'Full capability',
              contactId: 'C008',
              history: [
                {
                  position: 'Q18',
                  status: {
                    state: 'Moored'
                  },
                  turn: 2
                }
              ],
              locationPending: true,
              name: 'Dhow-C',
              perceptions: [],
              plannedTurns: [
                {
                  route: [
                    'P16'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 3
                },
                {
                  route: [
                    'O16'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 4
                },
                {
                  route: [
                    'N15'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 5
                }
              ],
              platformType: 'fishing-vessel',
              position: 'P17',
              route: [
                'P17'
              ],
              status: {
                speedKts: 10,
                state: 'Transiting'
              },
              uniqid: 'a0pra000102'
            },
            {
              condition: 'Full capability',
              contactId: 'C076',
              history: [
                {
                  position: 'Q12',
                  status: {
                    state: 'Inactive'
                  },
                  turn: 2
                }
              ],
              locationPending: true,
              name: 'Missile-A',
              perceptions: [],
              plannedTurns: [],
              platformType: 'coastal-radar-site',
              position: 'Q12',
              status: {
                state: 'Inactive'
              },
              uniqid: 'a0pra000103'
            }
          ],
          color: '#F00',
          dirty: false,
          icon: 'images/default_img/umpireDefault.png',
          name: 'Red',
          overview: 'Red force.',
          roles: [
            {
              isGameControl: false,
              isInsightViewer: false,
              isObserver: false,
              name: 'CO',
              password: 'p3244',
              canSubmitPlans: false
            }
          ],
          umpire: false,
          uniqid: 'Red'
        },
        {
          assets: [
            {
              condition: 'Full capability',
              contactId: 'C015',
              history: [
                {
                  position: 'H00',
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 2
                }
              ],
              name: 'Tanker-1',
              perceptions: [
                {
                  by: 'Blue',
                  force: 'Green',
                  name: 'OSAKA',
                  type: 'merchant-vessel'
                }
              ],
              plannedTurns: [
                {
                  route: [
                    'I04',
                    'I05',
                    'I06',
                    'I06'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 3
                },
                {
                  route: [
                    'I07',
                    'I08',
                    'I09',
                    'I10'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 4
                },
                {
                  route: [
                    'I11',
                    'J11',
                    'J12',
                    'J13'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 5
                },
                {
                  route: [
                    'K14',
                    'L14',
                    'M15',
                    'M16'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 6
                },
                {
                  route: [
                    'M17',
                    'M18',
                    'N18',
                    'N19'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 7
                },
                {
                  route: [
                    'O20',
                    'O21',
                    'P21',
                    'Q22'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 8
                },
                {
                  status: {
                    state: 'Moored'
                  },
                  turn: 9
                },
                {
                  status: {
                    state: 'Moored'
                  },
                  turn: 10
                },
                {
                  status: {
                    state: 'Moored'
                  },
                  turn: 11
                }
              ],
              platformType: 'merchant-vessel',
              position: 'H03',
              route: [
                'H00',
                'H01',
                'H02',
                'H03'
              ],
              status: {
                speedKts: 20,
                state: 'Transiting'
              },
              uniqid: 'a0pra000200'
            },
            {
              condition: 'Full capability',
              contactId: 'C081',
              history: [
                {
                  position: 'C00',
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 2
                }
              ],
              name: 'Tanker-2',
              perceptions: [
                {
                  by: 'Blue',
                  force: 'Green',
                  name: 'ARUNA 12',
                  type: 'merchant-vessel'
                },
                {
                  by: 'Red',
                  force: 'Green',
                  name: 'BARLAY',
                  type: 'merchant-vessel'
                }
              ],
              plannedTurns: [
                {
                  route: [
                    'C00',
                    'C01',
                    'C02',
                    'C03'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 3
                },
                {
                  route: [
                    'C04',
                    'C05',
                    'C06',
                    'C07'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 4
                },
                {
                  route: [
                    'D07',
                    'E08',
                    'F08',
                    'G08'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 5
                },
                {
                  route: [
                    'H08',
                    'H09',
                    'I09',
                    'I10'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 6
                },
                {
                  route: [
                    'I11',
                    'J11',
                    'J12',
                    'J13'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 7
                },
                {
                  route: [
                    'K14',
                    'L14',
                    'M15',
                    'M16'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 8
                },
                {
                  route: [
                    'M17',
                    'M18',
                    'N18',
                    'N19'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 9
                },
                {
                  route: [
                    'O20',
                    'O21',
                    'P21',
                    'Q22'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 10
                },
                {
                  route: [
                    'R22',
                    'S22',
                    'T22',
                    'U23'
                  ],
                  status: {
                    speedKts: 20,
                    state: 'Transiting'
                  },
                  turn: 11
                }
              ],
              platformType: 'merchant-vessel',
              position: 'C00',
              status: {
                state: 'Moored'
              },
              uniqid: 'a0pra000201'
            },
            {
              condition: 'Full capability',
              contactId: 'C116',
              history: [
                {
                  position: 'M02',
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 2
                }
              ],
              name: 'Fisher-A',
              perceptions: [
                {
                  by: 'Blue',
                  force: 'Green',
                  name: 'JALIBUT',
                  type: 'merchant-vessel'
                }
              ],
              plannedTurns: [
                {
                  route: [
                    'J03',
                    'I04'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 3
                },
                {
                  status: {
                    state: 'Fishing'
                  },
                  turn: 4
                },
                {
                  route: [
                    'I05',
                    'I06'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 5
                },
                {
                  route: [
                    'I07',
                    'I08'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 6
                },
                {
                  status: {
                    state: 'Fishing'
                  },
                  turn: 7
                },
                {
                  route: [
                    'J07',
                    'K07'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 8
                },
                {
                  route: [
                    'L06',
                    'M06'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 9
                },
                {
                  status: {
                    state: 'Fishing'
                  },
                  turn: 10
                },
                {
                  route: [
                    'M05',
                    'M04'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 11
                }
              ],
              platformType: 'fishing-vessel',
              position: 'K03',
              route: [
                'M02',
                'K03'
              ],
              status: {
                speedKts: 10,
                state: 'Transiting'
              },
              uniqid: 'a0pra000202'
            },
            {
              condition: 'Full capability',
              contactId: 'C026',
              history: [
                {
                  position: 'N08',
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 2
                }
              ],
              name: 'Fisher-B',
              perceptions: [
                {
                  by: 'Blue',
                  force: 'Green',
                  type: 'merchant-vessel'
                }
              ],
              plannedTurns: [
                {
                  status: {
                    state: 'Fishing'
                  },
                  turn: 3
                },
                {
                  route: [
                    'K10',
                    'K09'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 4
                },
                {
                  route: [
                    'K08',
                    'K07'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 5
                },
                {
                  route: [
                    'K06',
                    'M06'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 6
                },
                {
                  status: {
                    state: 'Fishing'
                  },
                  turn: 7
                },
                {
                  route: [
                    'N06',
                    'N07'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 8
                },
                {
                  route: [
                    'M08',
                    'L08'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 9
                },
                {
                  status: {
                    state: 'Fishing'
                  },
                  turn: 10
                },
                {
                  status: {
                    state: 'Fishing'
                  },
                  turn: 11
                },
                {
                  status: {
                    state: 'Fishing'
                  },
                  turn: 12
                }
              ],
              platformType: 'fishing-vessel',
              position: 'L09',
              route: [
                'N08',
                'L09'
              ],
              status: {
                speedKts: 10,
                state: 'Transiting'
              },
              uniqid: 'a0pra000203'
            },
            {
              condition: 'Full capability',
              contactId: 'C115',
              history: [
                {
                  position: 'N11',
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 2
                }
              ],
              name: 'Fisher-C',
              perceptions: [
                {
                  by: 'Blue',
                  force: 'Green',
                  name: 'BOUM 3',
                  type: 'merchant-vessel'
                },
                {
                  by: 'Red',
                  force: 'Green',
                  name: 'BOUM 3',
                  type: 'merchant-vessel'
                }
              ],
              plannedTurns: [
                {
                  route: [
                    'K10',
                    'J09'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 3
                },
                {
                  status: {
                    state: 'Fishing'
                  },
                  turn: 4
                },
                {
                  route: [
                    'K08',
                    'K07'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 5
                },
                {
                  route: [
                    'K06',
                    'M06'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 6
                },
                {
                  status: {
                    state: 'Fishing'
                  },
                  turn: 7
                },
                {
                  route: [
                    'N06',
                    'N07'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 8
                },
                {
                  route: [
                    'M08',
                    'L08'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 9
                },
                {
                  status: {
                    state: 'Fishing'
                  },
                  turn: 10
                },
                {
                  route: [
                    'M09',
                    'N08'
                  ],
                  status: {
                    speedKts: 10,
                    state: 'Transiting'
                  },
                  turn: 11
                }
              ],
              platformType: 'fishing-vessel',
              position: 'L10',
              route: [
                'N11',
                'L10'
              ],
              status: {
                speedKts: 10,
                state: 'Transiting'
              },
              uniqid: 'a0pra000204'
            }
          ],
          color: '#0F0',
          controlledBy: [
            'umpire'
          ],
          dirty: false,
          icon: 'images/default_img/umpireDefault.png',
          name: 'Green',
          overview: 'Green Shipping',
          roles: [
            {
              isGameControl: false,
              isInsightViewer: false,
              isObserver: false,
              name: 'CO',
              password: 'P9454',
              canSubmitPlans: false
            }
          ],
          umpire: false,
          uniqid: 'Green'
        }
      ],
      name: 'Forces',
      selectedForce: ''
    },
    overview: {
      complete: true,
      dirty: false,
      gameDate: '2020-01-07T13:18',
      gameDescription: 'Sample MWARC Wargame',
      gameTurnTime: 5400000,
      name: 'Overview - settings',
      realtimeTurnTime: 600000,
      showAccessCodes: true,
      timeWarning: 60000
    },
    platform_types: {
      complete: false,
      dirty: false,
      name: 'Platform Types',
      platformTypes: [
        {
          conditions: [
            'Full capability',
            'Limited capability',
            'Illegally boarded',
            'Immobile',
            'Sinking',
            'Destroyed'
          ],
          icon: 'fishing-vessel.svg',
          name: 'Fishing vessel',
          speedKts: [
            10,
            20
          ],
          states: [
            {
              mobile: true,
              name: 'Transiting'
            },
            {
              mobile: false,
              name: 'Fishing'
            },
            {
              mobile: false,
              name: 'Moored'
            }
          ],
          travelMode: 'sea'
        },
        {
          conditions: [
            'Full capability',
            'Limited capability',
            'Immobile',
            'Sinking',
            'Destroyed'
          ],
          icon: 'frigate.svg',
          name: 'Frigate',
          speedKts: [
            10,
            20,
            30
          ],
          states: [
            {
              mobile: true,
              name: 'Transiting'
            },
            {
              mobile: false,
              name: 'Stopped'
            },
            {
              mobile: false,
              name: 'Moored'
            }
          ],
          travelMode: 'sea'
        },
        {
          conditions: [
            'Full capability',
            'Limited capability',
            'Immobile',
            'Sinking',
            'Destroyed'
          ],
          icon: 'boghammer.svg',
          name: 'Boghammer',
          speedKts: [
            10,
            20,
            30,
            40
          ],
          states: [
            {
              mobile: true,
              name: 'Transiting'
            },
            {
              mobile: false,
              name: 'Stopped'
            },
            {
              mobile: false,
              name: 'Moored'
            }
          ],
          travelMode: 'sea'
        },
        {
          conditions: [
            'Full capability',
            'Limited capability',
            'Destroyed'
          ],
          icon: 'torpedo.svg',
          name: 'torpedo',
          speedKts: [
            10
          ],
          states: [
            {
              mobile: false,
              name: 'Onboard'
            },
            {
              deploying: true,
              mobile: true,
              name: 'Deploy'
            },
            {
              mobile: true,
              name: 'Transiting'
            }
          ],
          travelMode: 'sea'
        },
        {
          conditions: [
            'Full capability',
            'Limited capability',
            'Immobile',
            'Sinking',
            'Destroyed'
          ],
          icon: 'fast-attack-craft.svg',
          name: 'Fast attack craft',
          speedKts: [
            10,
            20,
            30,
            40,
            50
          ],
          states: [
            {
              mobile: true,
              name: 'Transiting'
            },
            {
              mobile: false,
              name: 'Stopped'
            },
            {
              mobile: false,
              name: 'Moored'
            }
          ],
          travelMode: 'sea'
        },
        {
          conditions: [
            'Full capability',
            'Limited capability',
            'Immobile',
            'Sinking',
            'Destroyed'
          ],
          icon: 'mcmv.svg',
          name: 'MCMV',
          speedKts: [
            10
          ],
          states: [
            {
              mobile: true,
              name: 'Transiting'
            },
            {
              mobile: false,
              name: 'Stopped'
            },
            {
              mobile: false,
              name: 'Moored'
            }
          ],
          travelMode: 'sea'
        },
        {
          conditions: [
            'Full capability',
            'Limited capability',
            'Immobile',
            'Destroyed'
          ],
          icon: 'helicopter.svg',
          name: 'Helicopter',
          speedKts: [],
          states: [
            {
              mobile: true,
              name: 'Airborne'
            },
            {
              mobile: false,
              name: 'Landed'
            },
            {
              mobile: false,
              name: 'Preparing for launch'
            }
          ],
          travelMode: 'air'
        },
        {
          conditions: [
            'Full capability',
            'Limited capability',
            'Immobile',
            'Destroyed'
          ],
          icon: 'fixed-wing-aircraft.svg',
          name: 'Fixed wing aircraft',
          speedKts: [],
          states: [
            {
              mobile: true,
              name: 'Airborne'
            },
            {
              mobile: false,
              name: 'Landed'
            },
            {
              mobile: false,
              name: 'Preparing for launch'
            }
          ],
          travelMode: 'air'
        },
        {
          conditions: [
            'Full capability',
            'Limited capability',
            'Destroyed'
          ],
          icon: 'coastal-radar-site.svg',
          name: 'Coastal radar site',
          states: [
            {
              mobile: false,
              name: 'Inactive'
            },
            {
              mobile: false,
              name: 'Active'
            },
            {
              mobile: false,
              name: 'Engaging'
            }
          ],
          travelMode: 'land'
        },
        {
          conditions: [
            'Full capability',
            'Limited capability',
            'Illegally boarded',
            'Immobile',
            'Sinking',
            'Destroyed'
          ],
          icon: 'merchant-vessel.svg',
          name: 'Merchant vessel',
          speedKts: [
            10,
            20
          ],
          states: [
            {
              mobile: true,
              name: 'Transiting'
            },
            {
              mobile: false,
              name: 'Stopped'
            },
            {
              mobile: false,
              name: 'Moored'
            }
          ],
          travelMode: 'sea'
        }
      ],
      selectedType: ''
    }
  },
  currentTab: 'channels',
  wargameInitiated: true,
  adminNotLoggedIn: false
}