function calculateFuelFromMass(mass) {
  return Math.floor(mass / 3) - 2;
}

const payloads = `78207
89869
145449
73634
78681
81375
131482
126998
50801
115839
77949
53203
146099
56912
59925
132631
115087
89543
123234
108110
109873
81923
124264
87981
106554
147239
73615
72609
129684
84175
64915
98124
74391
55211
120961
119116
148275
89605
115986
120547
50299
137922
78906
145216
80424
122610
61408
97573
127533
116820
76068
77400
117943
85231
102442
62002
58761
56479
98200
85971
73985
88908
82719
120604
83378
88241
122574
76731
99810
137548
102617
105352
137585
83238
118817
149419
107629
63893
56049
70693
83844
76413
87021
90259
124289
102527
139625
106607
120241
101098
66142
96591
82277
142297
116671
131881
94861
79741
73561
115214`
  .split("\n")
  .filter(Boolean);

const totalPayload = payloads.reduce(add, 0);

const totalFuelMass = calculateFuelFromMass(totalPayload);

function add(a, b) {
  return a + b;
}

function calculateRecursiveFuelFromMass(mass) {
  let fuelMass = 0;
  let moreFuel = mass;
  while ((moreFuel = calculateFuelFromMass(moreFuel)) > 0) {
    fuelMass += moreFuel;
  }

  return fuelMass;
}

const totalRecursivePayload = payloads
  .map(calculateRecursiveFuelFromMass)
  .reduce(add, 0);

module.exports = {
  calculateFuelFromMass,
  totalFuelMass,
  calculateRecursiveFuelFromMass,
  totalRecursivePayload
};
