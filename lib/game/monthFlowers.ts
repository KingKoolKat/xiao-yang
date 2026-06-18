import { getCourseMonthOrderIndex } from "@/lib/game/monthBuildings";

export type MonthFlowerShape =
  | "ruffled"
  | "five-petal"
  | "trumpet"
  | "daisy"
  | "bells"
  | "rose"
  | "spike"
  | "burst";

export interface MonthFlower {
  monthIndex: number;
  monthName: string;
  shortName: string;
  flowerName: string;
  shape: MonthFlowerShape;
  petalColor: string;
  centerColor: string;
  leafColor: string;
}

export const monthFlowers: MonthFlower[] = [
  {
    monthIndex: 0,
    monthName: "January",
    shortName: "Jan",
    flowerName: "Carnation",
    shape: "ruffled",
    petalColor: "#F2AFC0",
    centerColor: "#D97892",
    leafColor: "#87B58A"
  },
  {
    monthIndex: 1,
    monthName: "February",
    shortName: "Feb",
    flowerName: "Violet",
    shape: "five-petal",
    petalColor: "#9A83C9",
    centerColor: "#F4D67A",
    leafColor: "#79A77D"
  },
  {
    monthIndex: 2,
    monthName: "March",
    shortName: "Mar",
    flowerName: "Daffodil",
    shape: "trumpet",
    petalColor: "#F8DB68",
    centerColor: "#EFA04B",
    leafColor: "#78A868"
  },
  {
    monthIndex: 3,
    monthName: "April",
    shortName: "Apr",
    flowerName: "Daisy",
    shape: "daisy",
    petalColor: "#FFFDF6",
    centerColor: "#E6B947",
    leafColor: "#7AAE76"
  },
  {
    monthIndex: 4,
    monthName: "May",
    shortName: "May",
    flowerName: "Lily of the Valley",
    shape: "bells",
    petalColor: "#FFFDF6",
    centerColor: "#E8D9BA",
    leafColor: "#6C9F70"
  },
  {
    monthIndex: 5,
    monthName: "June",
    shortName: "Jun",
    flowerName: "Rose",
    shape: "rose",
    petalColor: "#E995AA",
    centerColor: "#B85C72",
    leafColor: "#6E9B69"
  },
  {
    monthIndex: 6,
    monthName: "July",
    shortName: "Jul",
    flowerName: "Larkspur",
    shape: "spike",
    petalColor: "#8194D6",
    centerColor: "#D8DDF5",
    leafColor: "#668F72"
  },
  {
    monthIndex: 7,
    monthName: "August",
    shortName: "Aug",
    flowerName: "Gladiolus",
    shape: "spike",
    petalColor: "#EF9A8F",
    centerColor: "#F7D1A7",
    leafColor: "#71996A"
  },
  {
    monthIndex: 8,
    monthName: "September",
    shortName: "Sep",
    flowerName: "Aster",
    shape: "daisy",
    petalColor: "#9D8ACB",
    centerColor: "#E5B94F",
    leafColor: "#739A72"
  },
  {
    monthIndex: 9,
    monthName: "October",
    shortName: "Oct",
    flowerName: "Marigold",
    shape: "ruffled",
    petalColor: "#F2A447",
    centerColor: "#C96A36",
    leafColor: "#779B64"
  },
  {
    monthIndex: 10,
    monthName: "November",
    shortName: "Nov",
    flowerName: "Chrysanthemum",
    shape: "burst",
    petalColor: "#E5BD55",
    centerColor: "#B98534",
    leafColor: "#748E62"
  },
  {
    monthIndex: 11,
    monthName: "December",
    shortName: "Dec",
    flowerName: "Narcissus",
    shape: "daisy",
    petalColor: "#FFFDF6",
    centerColor: "#EAC957",
    leafColor: "#6F9A78"
  }
];

export function getCourseOrderedMonthFlowers(): MonthFlower[] {
  return [...monthFlowers].sort(
    (a, b) =>
      getCourseMonthOrderIndex(a.monthIndex) - getCourseMonthOrderIndex(b.monthIndex)
  );
}
