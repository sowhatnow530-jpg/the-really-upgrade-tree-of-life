import { player, temp } from "@/main"
import { Effect, EffectType } from "@/utils/effect"
import { format, formatMult, formatPercent, formatPow } from "@/utils/formats"
import { splitIntoGroups } from "@/utils/misc"
import type { DecimalSource } from "break_eternity.js"
import Decimal from "break_eternity.js"
import { Currencies } from "./currencies"
import { DC, expPow, softcap } from "@/utils/decimal"

export const Upgrades: Record<string, {
  description: string
  priority?: number

  branch: string[]
  condition?(): boolean
  cost: [string, DecimalSource]
  permanent?: boolean

  effect?: Effect

  nospend?: boolean
  onbuy?(): void

  [index: string]: unknown
}> = {
  //#region Leaf
  "L\\-20": {
    get description() { return `True Autumn Leaves boost Sacred Leaves.` },
    branch: ["L\\-19"],

    cost: ['leaves', 'e100000'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'sacred',
      calc: () => Decimal.add(player.fallen[6], 1).log(100).add(1),
    }),
  },
  "L\\-19": {
    get description() { return `Sacred Leaves boost <b>FR2</b>'s base.` },
    branch: ["L\\-16"],

    cost: ['leaves', 'e90000'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.add(player.sacred, 1).log(1e3).add(1),
    }),
  },
  "L\\-18": {
    permanent: true,
    get description() { return `Unlock <b>Spring</b> season permanently.` },
    branch: ["L\\-14"],

    cost: ['leaves', 'e75000'],
  },
  "L\\-17": {
    get description() { return `Tree age boosts Entropy.` },
    branch: ["L\\-13"],

    cost: ['leaves', 'e50000'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: "entropy",
      calc: () => Decimal.add(player.age, 1).pow(.003),
    }),
  },
  "L\\-16": {
    get description() { return `Total Roots increase Basket cap.` },
    branch: ["L\\-15"],

    cost: ['leaves', 'e32000'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'fallen-basket',
      calc: () => Decimal.add(player.root.total, 1).log10().div(5).add(1),
    }),
  },
  "L\\-15": {
    get description() { return `<b>${formatMult(3)}</b> to Leaves falling speed and Basket cap.` },
    branch: ["L\\-14"],

    cost: ['leaves', 'e22500'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['fallen-speed','fallen-basket'],
      calc: () => 3,
    }),
  },
  "L\\-14": {
    permanent: true,
    get description() { return `Unlock <b>Summer</b> season permanently.` },
    branch: ["L\\-10"],

    cost: ['leaves', 'e10000'],
  },
  "L\\-13": {
    get description() { return `Tree age boosts Fruits.` },
    branch: ["L\\-12"],

    cost: ['leaves', 'e7300'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: "fruits",
      calc: () => Decimal.add(player.age, 1).pow(.04),
    }),
  },
  "L\\-12": {
    get description() { return `Tree age boosts Seeds.` },
    branch: ["L\\-10"],

    cost: ['leaves', 'e6000'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: "seeds",
      calc: () => Decimal.add(player.age, 1).pow(.08),
    }),
  },
  "L\\-11": {
    get description() { return `<b>LR2</b>'s level boosts Bacteria's limit at a reduced rate.` },
    branch: ["L\\-10"],

    cost: ['leaves', 'e4750'],

    effect: new Effect({
      type: EffectType.Exponent,
      static: false,
      group: "bacteria-limit",
      calc: () => softcap(Decimal.mul(player.repeatable_upgrades["LR\\2"][0], .015).add(1), 2, .5, "P"),
    }),
  },
  "L\\-10": {
    permanent: true,
    get description() { return `Unlock a new set of Challenges permanently.` },
    branch: ["L\\-9"],

    cost: ['leaves', 'e3150'],
  },
  "L\\-9": {
    get description() { return `Bacteria Types also increase Bacteria's limit.` },
    branch: ["L\\-6","L\\-7","L\\-8"],

    cost: ['leaves', 'e2750'],

    effect: new Effect({
      type: EffectType.Exponent,
      static: false,
      group: "bacteria-limit",
      calc: () => Decimal.sub(player.bacteria.types, 1).max(0).mul(.05).add(1),
    }),
  },
  "L\\-8": {
    get description() { return `<b>${formatPow(1.05)}</b> to static Entropy multiplier.` },
    branch: ["L\\-5"],

    cost: ['leaves', 'e2250'],

    effect: new Effect({
      type: EffectType.BaseExponent,
      static: true,
      group: 'entropy',
      calc: () => 1.05,
    }),
  },
  "L\\-7": {
    get description() { return `<b>${formatMult(1e3)}</b> to Tree aging speed and Cell replication speed.` },
    branch: ["L\\-5"],

    cost: ['leaves', 'e2000'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['age','cell-speed'],
      calc: () => 1e3,
    }),
  },
  "L\\-6": {
    get description() { return `Fruits boost Leaves at a reduced rate.` },
    branch: ["L\\-5"],

    cost: ['leaves', 'e1750'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: "leaves",
      calc: () => expPow(Decimal.add(player.fruits, 1), .5),
    }),
  },
  "L\\-5": {
    condition: () => hasUpgrade("RO\\1"),
    get description() { return `<i>Welcome back!</i> <b>${formatMult(1e10)}</b> to Leaves, Seeds, and Fruits.` },
    branch: ["L\\-4"],

    cost: ['leaves', 'e1500'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits'],
      calc: () => 1e10,
    }),
  },
  "L\\-4": {
    get description() { return `<i>Prepare for the next layer.</i> <b>${formatMult(1e25)}</b> to Leaves.` },
    branch: ["L\\-3"],

    cost: ['leaves', 'e1400'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "leaves",
      calc: () => 1e25,
    }),
  },
  "L\\-3": {
    get description() { return `<b>S20</b>'s compounding effect is affected by <b>E9</b>.` },
    branch: ["L\\-2"],

    cost: ['leaves', 'e1300'],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.div(Effect.effect("upg-E\\9"), 10).root(2),
      display: x => "+"+formatPercent(x),
    }),
  },
  "L\\-2": {
    get description() { return `<i>Are you kidding me?</i> <b>${formatPow(1.1)}</b> to Bacteria.` },
    branch: ["L\\-1"],

    cost: ['leaves', 'e1200'],

    effect: new Effect({
      type: EffectType.Exponent,
      static: true,
      group: 'bacteria',
      calc: () => 1.1,
    }),
  },
  "L\\-1": {
    get description() { return `<i>Wait, that's illegal.</i> <b>${formatMult(10)}</b> to Leaves, Seeds, Fruits, Tree aging speed, and Cell replication speed.` },
    branch: ["L\\49"],

    cost: ['leaves', 'e1000'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','age','seeds','fruits','cell-speed'],
      calc: () => 10,
    }),
  },
  "L\\0": {
    description: `Start generating Leaves and Tree Age.`,
    branch: [],

    cost: ['leaves', 0],
  },
  "L\\1": {
    get description() { return `<b>${formatMult(999)}</b> to Leaves.` },
    branch: ["L\\0"],

    cost: ['leaves', 10],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 999,
    }),
  },
  "L\\2": {
    get description() { return `<b>${formatMult(3)}</b> to Leaves.` },
    branch: ["L\\1"],

    cost: ['leaves', 30],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 3,
    }),
  },
  "L\\3": {
    get description() { return `Tree Age boosts Leaves.` },
    branch: ["L\\1"],

    cost: ['leaves', 150],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'leaves',
      calc: () => Decimal.div(player.age, 10).add(1).sqrt().pow(temp.weathers[3]),
    }),
  },
  "L\\4": {
    get description() { return `<b>${formatMult(2.5)}</b> to Leaves.` },
    branch: ["L\\2"],

    cost: ['leaves', 500],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 2.5,
    }),
  },
  "L\\5": {
    get description() { return `<b>${formatMult(3)}</b> to Leaves.` },
    branch: ["L\\2"],

    cost: ['leaves', 1500],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 3,
    }),
  },
  "L\\6": {
    get description() { return `<b>${formatMult(3)}</b> to Leaves.` },
    branch: ["L\\4"],

    cost: ['leaves', 5000],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 3,
    }),
  },
  "L\\7": {
    get description() { return `<b>${formatMult(1.75)}</b> to Leaves.` },
    branch: ["L\\5"],

    cost: ['leaves', 7500],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 1.75,
    }),
  },
  "L\\8": {
    get description() { return `Tree Age boosts Leaves more.` },
    branch: ["L\\3"],

    cost: ['leaves', 2.4e4],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'leaves',
      calc: () => Decimal.div(player.age, 4).add(1).sqrt().pow(temp.weathers[3]),
    }),
  },
  "L\\9": {
    get description() { return `Leaves are increased by <b>${formatPercent(Decimal.sub(this.effect!.variables.base, 1))}</b> compounding every purchased upgrade.` },
    branch: ["L\\8"],

    cost: ['leaves', 2e5],

    effect: new Effect({
      variables: {
        get base() { return Decimal.add(hasUpgrade("L\\25") ? 1.2 : 1.15, Effect.effect("upg-E\\9")) },
      },
      type: EffectType.Multiplier,
      static: false,
      group: 'leaves',
      calc() { return Decimal.pow(this.variables.base, temp.purchasedUpgrades) },
    }),
  },
  "L\\10": {
    get description() { return `Leaves boost themselves.` },
    branch: ["L\\7","L\\9"],

    cost: ['leaves', 6.5e5],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'leaves',
      calc: () => Decimal.add(player.leaves, 10).log10().pow(hasUpgrade("L\\14")?2:1).pow(Effect.effect("upg-S\\29")).pow(temp.weathers[1]),
    }),
  },
  "L\\11": {
    condition: () => hasUpgrade("S\\3"),
    get description() { return `<b>${formatMult(5)}</b> to Leaves.` },
    branch: ["L\\6"],

    cost: ['leaves', 2.5e7],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 5,
    }),
  },
  "L\\12": {
    condition: () => hasUpgrade("S\\3"),
    get description() { return `<b>${formatMult(4)}</b> to Leaves.` },
    branch: ["L\\10"],

    cost: ['leaves', 1.75e8],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 4,
    }),
  },
  "L\\13": {
    get description() { return `<b>${formatMult(5)}</b> to Leaves.` },
    branch: ["L\\11"],

    cost: ['leaves', 6e10],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 5,
    }),
  },
  "L\\14": {
    get description() { return `<b>L10</b>'s effect is <b>squared</b>.` },
    branch: ["L\\11"],

    cost: ['leaves', 1.5e9],
  },
  "L\\15": {
    get description() { return `Tree Age boosts Leaves even more.` },
    branch: ["L\\10"],

    cost: ['leaves', 5e12],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'leaves',
      calc: () => Decimal.div(player.age, 25).add(1).cbrt().pow(temp.weathers[3]),
    }),
  },
  "L\\16": {
    get description() { return `Leaves boost Seeds gain.` },
    branch: ["L\\12","L\\13","L\\14","L\\15"],

    cost: ['leaves', 1e15],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'seeds',
      calc: () => Decimal.div(player.leaves, 1e13).add(10).log10().pow(Effect.effect("upg-E\\7")),
    }),
  },
  "L\\17": {
    get description() { return `<b>${formatMult(3)}</b> to Seeds.` },
    branch: ["L\\16"],

    cost: ['leaves', 7.5e15],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'seeds',
      calc: () => 3,
    }),
  },
  "L\\18": {
    get description() { return `<b>${formatMult(3)}</b> to Seeds.` },
    branch: ["L\\16"],

    cost: ['leaves', 5e17],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'seeds',
      calc: () => 3,
    }),
  },
  "L\\19": {
    get description() { return `Leaves boost themselves more.` },
    branch: ["L\\17"],

    cost: ['leaves', 1e23],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'leaves',
      calc: () => Decimal.add(player.leaves, 1).root(10),
    }),
  },
  "L\\20": {
    get description() { return `<b>${formatMult(3)}</b> to Leaves and Seeds.` },
    branch: ["L\\16"],

    cost: ['leaves', 1e33],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds'],
      calc: () => 3,
    }),
  },
  "L\\21": {
    get description() { return `<b>${formatMult(2)}</b> to Composting speed.` },
    branch: ["L\\19"],

    cost: ['leaves', 2.5e36],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'composting-speed',
      calc: () => 2,
    }),
  },
  "L\\22": {
    get description() { return `<b>${formatMult(3)}</b> to Leaves, <b>${formatMult(2)}</b> to Seeds, <b>${formatMult(1.5)}</b> to Fruits.` },
    branch: ["L\\20"],

    cost: ['leaves', 1e39],
  },
  "L\\23": {
    get description() { return `Leaves boost Composting speed.` },
    branch: ["L\\19"],

    cost: ['leaves', 5e43],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'composting-speed',
      calc: () => Decimal.div(player.leaves, 1e40).add(10).log10(),
    }),
  },
  "L\\24": {
    get description() { return `<b>${formatMult(2)}</b> to Tree aging speed.` },
    branch: ["L\\21"],

    cost: ['leaves', 5e45],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'age',
      calc: () => 2,
    }),
  },
  "L\\25": {
    get description() { return `<b>L9</b>'s compounding effect is increased to <b>20%</b>.` },
    branch: ["L\\19"],

    cost: ['leaves', 1e48],
  },
  "L\\26": {
    get description() { return `<b>${formatMult(10)}</b> to Tree aging speed.` },
    branch: ["L\\24"],

    cost: ['leaves', 3.5e51],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'age',
      calc: () => 10,
    }),
  },
  "L\\27": {
    get description() { return `<b>${formatMult(4)}</b> to Seeds.` },
    branch: ["L\\22"],

    cost: ['leaves', 1e57],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'seeds',
      calc: () => 4,
    }),
  },
  "L\\28": {
    condition: () => hasUpgrade("F\\18"),
    get description() { return `<b>${formatMult(50)}</b> to Leaves, <b>${formatMult(15)}</b> to Seeds, <b>${formatMult(5)}</b> to Fruits. It causes <b>Potential Energy</b>.` },
    branch: ["L\\15"],

    cost: ['leaves', 1e60],
  },
  "L\\29": {
    get description() { return `<b>-2.5</b> leaf root in the PE formula.` },
    branch: ["L\\26","L\\27"],

    cost: ['leaves', 1e75],
  },
  "L\\30": {
    get description() { return `<b>${formatMult(5)}</b> to Leaves, <b>${formatMult(3)}</b> to Seeds, <b>${formatMult(2)}</b> to Fruits.` },
    branch: ["L\\29"],

    cost: ['leaves', 1e100],
  },
  "L\\31": {
    get description() { return `<b>${formatMult(10)}</b> to Leaves.` },
    branch: ["L\\30"],

    cost: ['leaves', 1e105],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 10,
    }),
  },
  "L\\32": {
    get description() { return `<b>${formatMult(3)}</b> to Seeds.` },
    branch: ["L\\29"],

    cost: ['leaves', 1.11e111],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'seeds',
      calc: () => 3,
    }),
  },
  "L\\33": {
    get description() { return `<b>${formatMult(2)}</b> to Leaves and Seeds.` },
    branch: ["L\\29"],

    cost: ['leaves', 2.5e118],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves', 'seeds'],
      calc: () => 2,
    }),
  },
  "L\\34": {
    get description() { return `<b>${formatMult(3)}</b> to L,S,F and <b>${formatMult(5)}</b> to Tree aging speed.` },
    branch: ["L\\32"],

    cost: ['leaves', 1e127],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves', 'seeds', 'fruits'],
      calc: () => 3,
    }),
  },
  "L\\35": {
    get description() { return `Base Leaf's Fertilizer scaling is divided by <b>15</b>.` },
    branch: ['L\\34'],

    cost: ['leaves', 1e137],
  },
  "L\\36": {
    get description() { return `<b>${formatMult(3)}</b> to Leaves, Seeds, and Fruits.` },
    branch: ["L\\34"],

    cost: ['leaves', 1e150],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves', 'seeds', 'fruits'],
      calc: () => 3,
    }),
  },
  "L\\37": {
    get description() { return `<b>${formatMult(10)}</b> to Tree aging speed.` },
    branch: ["L\\36"],

    cost: ['leaves', 1e165],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'age',
      calc: () => 10,
    }),
  },
  "L\\38": {
    get description() { return `<b>${formatMult(100)}</b> to Leaves, <b>${formatMult(25)}</b> to Composting speed, <b>${formatMult(1.2)}</b> to Entropy.` },
    branch: ["L\\37"],

    cost: ['leaves', 1e190],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 10,
    }),
  },
  "L\\39": {
    get description() { return `Base Leaf's Fertilizer scaling is divided by <b>50</b>.` },
    branch: ["L\\38"],

    cost: ['leaves', 1e230],
  },
  "L\\40": {
    get description() { return `Tree Age boosts itself.` },
    branch: ["L\\39"],

    cost: ['leaves', 1e243],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'age',
      calc: () => Decimal.div(player.age, 1e20).add(1).log10().add(1.5).pow(temp.weathers[2]),
    }),
  },
  "L\\41": {
    priority: 1,
    get description() { return `<b>F13</b>'s compounding effect is increased by <b>+0.05%</b> per total fertilizer, starting at <b>125</b>.` },
    branch: ["L\\39"],

    cost: ['leaves', 1e256],

    effect: new Effect({
      type: EffectType.None,
      static: false,
      calc: () => Decimal.sub(temp.total_fertilizers, 125).max(0).mul(.0005),
      display: x => "+"+formatPercent(x),
    }),
  },
  "L\\42": {
    get description() { return `<b>${formatMult(20)}</b> to Leaves, Tree aging speed, and Seeds and <b>${formatMult(2)}</b> to Fruits.` },
    branch: ["L\\39"],

    cost: ['leaves', 1e285],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','age','seeds'],
      calc: () => 20,
    }),
  },
  "L\\43": {
    get description() { return `<b>${formatMult(4.2)}</b> to Entropy. <i>Infinity Leaves!</i>` },
    branch: ["L\\40","L\\41","L\\42"],

    cost: ['leaves', DC.DE308],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'entropy',
      calc: () => 4.2,
    }),
  },
  "L\\44": {
    get description() { return `<b>${formatMult(3)}</b> to Cell replication speed.` },
    branch: ["L\\43"],

    cost: ['leaves', 'e450'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'cell-speed',
      calc: () => 3,
    }),
  },
  "L\\45": {
    get description() { return `Cell slightly boosts Entropy.` },
    branch: ["L\\43"],

    cost: ['leaves', 'e485'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'entropy',
      calc: () => Decimal.add(player.cell.amount, 1).log10().div(DC.DE308LOG).add(1),
    }),
  },
  "L\\46": {
    permanent: true,
    get description() { return `Unlock <b>The Statue</b> with a new repeatable upgrade permanently.` },
    branch: ["L\\43"],

    cost: ['leaves', 'e500'],
  },
  "L\\47": {
    get description() { return `Seeds boost static Leaf multiplier.` },
    branch: ["L\\43"],

    cost: ['leaves', '6.66e666'],

    effect: new Effect({
      type: EffectType.BaseExponent,
      static: false,
      group: 'leaves',
      // eNum.bnumtostr(eNum.add(1, eNum.mul(0.1, eNum.root(, "3"))))
      // eNum.bnumtostr(eNum.add(1, eNum.mul(0.9, eNum.root(eNum.UtilsLogx(eNum.UtilsLogx(game.Workspace.Stats.Seeds.Value, 10), "10"), "1"))))
      calc: () => softcap(Decimal.add(player.seeds, 1).log10().div(100).root(3).div(10).add(1), 2, 1, "LOG"),
    }),
  },
  "L\\48": {
    get description() { return `Fruits boost static Seed multiplier.` },
    branch: ["L\\43"],

    cost: ['leaves', 'e850'],

    effect: new Effect({
      type: EffectType.BaseExponent,
      static: false,
      group: 'seeds',
      // eNum.bnumtostr(eNum.add(1, eNum.mul(0.1, eNum.root(, "3"))))
      // eNum.bnumtostr(eNum.add(1, eNum.mul(0.9, eNum.root(eNum.UtilsLogx(eNum.UtilsLogx(game.Workspace.Stats.Seeds.Value, 10), "10"), "1"))))
      calc: () => softcap(Decimal.add(player.fruits, 1).log10().div(25).root(2).div(10).add(1), 2, 1, "LOG"),
    }),
  },
  "L\\49": {
    get description() { return `Entropy boosts static Fruit multiplier.` },
    branch: ["L\\43"],

    cost: ['leaves', 'e940'],

    effect: new Effect({
      type: EffectType.BaseExponent,
      static: false,
      group: 'fruits',
      // eNum.bnumtostr(eNum.add(1, eNum.mul(0.1, eNum.root(, "3"))))
      // eNum.bnumtostr(eNum.add(1, eNum.mul(0.9, eNum.root(eNum.UtilsLogx(eNum.UtilsLogx(game.Workspace.Stats.Seeds.Value, 10), "10"), "1"))))
      calc: () => Decimal.add(player.entropy, 1).log10().div(10).root(2).div(10).add(1),
    }),
  },
  //#endregion Leaf

  //#region Seed
  "S\\1": {
    condition: () => player.first.seed,
    get description() { return `<b>${formatMult(6)}</b> to Leaves.` },
    branch: [],

    cost: ['seeds', 1],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 6,
    }),
  },
  "S\\2": {
    get description() { return `<b>${formatMult(3)}</b> to Leaves.` },
    branch: ['S\\1'],

    cost: ['seeds', 3],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 3,
    }),
  },
  "S\\3": {
    get description() { return `Unlock more Leaf upgrades permanently.` },
    branch: ['S\\2'],
    permanent: true,

    cost: ['seeds', 7],
  },
  "S\\4": {
    get description() { return `Seeds boost Leaves generation.` },
    branch: ['S\\1'],

    cost: ['seeds', 35],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'leaves',
      calc: () => softcap(Decimal.add(player.seeds, 1).root(2), 1e5, hasUpgrade("S\\17") ? 0.625 : 0.5, "E"),
    }),
  },
  "S\\5": {
    get description() { return `<b>${formatMult(10)}</b> to Leaves.` },
    branch: ['S\\4'],

    cost: ['seeds', 175],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 10,
    }),
  },
  "S\\6": {
    get description() { return `<b>${formatMult(3)}</b> to Seeds.` },
    branch: ['S\\5'],

    cost: ['seeds', 2500],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'seeds',
      calc: () => 3,
    }),
  },
  "S\\7": {
    get description() { return `<b>${formatMult(5)}</b> to Leaves.` },
    branch: ['S\\6'],

    cost: ['seeds', 2e4],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 5,
    }),
  },
  "S\\8": {
    get description() { return `Seeds boost themselves.` },
    branch: ['S\\1'],

    cost: ['seeds', 1.5e5],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'seeds',
      calc: () => Decimal.div(player.seeds, 100).add(10).log10().pow(Effect.effect("upg-F\\20")).pow(temp.weathers[1]),
    }),
  },
  "S\\9": {
    get description() { return `<b>${formatMult(3)}</b> to Seeds.` },
    branch: ['S\\5'],

    cost: ['seeds', 4e6],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'seeds',
      calc: () => 3,
    }),
  },
  "S\\10": {
    get description() { return `<b>${formatMult(2)}</b> to Fruits.` },
    branch: ['S\\9'],

    cost: ['seeds', 1e8],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'fruits',
      calc: () => 2,
    }),
  },
  "S\\11": {
    get description() { return `<b>${formatMult(2)}</b> to Leaves.` },
    branch: ['S\\8'],

    cost: ['seeds', 5e8],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 2,
    }),
  },
  "S\\12": {
    get description() { return `<b>${formatMult(5)}</b> to Leaves.` },
    branch: ['S\\8'],

    cost: ['seeds', 5e9],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 5,
    }),
  },
  "S\\13": {
    get description() { return `<b>${formatMult(3)}</b> to Leaves.` },
    branch: ['S\\10'],

    cost: ['seeds', 1e12],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 3,
    }),
  },
  "S\\14": {
    get description() { return `<b>${formatMult(3)}</b> to Leaves.` },
    branch: ['S\\13'],

    cost: ['seeds', 1e13],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 3,
    }),
  },
  "S\\15": {
    get description() { return `<b>${formatMult(3)}</b> to Leaves.` },
    branch: ['S\\14'],

    cost: ['seeds', 1e14],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 3,
    }),
  },
  "S\\16": {
    get description() { return `<b>${formatMult(1.5)}</b> to Fruits.` },
    branch: ['S\\15'],

    cost: ['seeds', 1e15],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'fruits',
      calc: () => 1.5,
    }),
  },
  "S\\17": {
    get description() { return `<b>S4</b>'s effect softcap is weaker.` },
    branch: ['S\\16'],

    cost: ['seeds', 1e16],
  },
  "S\\18": {
    get description() { return `<b>${formatMult(2)}</b> to Composting speed.` },
    branch: ["S\\11"],

    cost: ['seeds', 1.5e17],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'composting-speed',
      calc: () => 2,
    }),
  },
  "S\\19": {
    get description() { return `<b>${formatMult(3)}</b> to Tree aging speed.` },
    branch: ["S\\18"],

    cost: ['seeds', 1e19],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'age',
      calc: () => 3,
    }),
  },
  "S\\20": {
    get description() { return `Seeds are increased by <b>${formatPercent(Decimal.sub(this.effect!.variables.base, 1))}</b> compounding every purchased upgrade.` },
    branch: ["S\\17"],

    cost: ['seeds', 1e21],

    effect: new Effect({
      variables: {
        get base() { return Decimal.add(hasUpgrade("S\\36") ? 1.1 : 1.05, Effect.effect("upg-L\\-3")) },
      },
      type: EffectType.Multiplier,
      static: false,
      group: 'seeds',
      calc() { return Decimal.pow(this.variables.base, temp.purchasedUpgrades).pow(Effect.effect("upg-F\\47")) },
    }),
  },
  "S\\21": {
    get description() { return `<b>${formatMult(10)}</b> to Leaves.` },
    branch: ['S\\20'],

    cost: ['seeds', 1e24],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 10,
    }),
  },
  "S\\22": {
    get description() { return `Leaves boost Fruits gain.` },
    branch: ['S\\20'],

    cost: ['seeds', 5e28],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'fruits',
      calc: () => Decimal.div(player.leaves, 1e60).add(1).root(10),
    }),
  },
  "S\\23": {
    get description() { return `<b>${formatMult(2)}</b> to Leaves, Seeds, Fruits.` },
    branch: ['S\\21'],

    cost: ['seeds', 1e30],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits'],
      calc: () => 2,
    }),
  },
  "S\\24": {
    get description() { return `<b>${formatMult(2)}</b> to Fruits.` },
    branch: ['S\\14'],

    cost: ['seeds', 5e31],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'fruits',
      calc: () => 2,
    }),
  },
  "S\\25": {
    get description() { return `<b>-1.5</b> seed root in the PE formula.` },
    branch: ['S\\23'],

    cost: ['seeds', 1e33],
  },
  "S\\26": {
    get description() { return `<b>${formatPow(1.2)}</b> to static Seed multiplier.` },
    branch: ["S\\23"],

    cost: ['seeds', 1e47],

    effect: new Effect({
      type: EffectType.BaseExponent,
      static: true,
      group: 'seeds',
      calc: () => 1.2,
    }),
  },
  "S\\27": {
    get description() { return `<b>${formatMult(10)}</b> to Leaves.` },
    branch: ['S\\3'],

    cost: ['seeds', 1e50],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 10,
    }),
  },
  "S\\28": {
    get description() { return `Cells boost Tree aging speed.` },
    branch: ['S\\27'],

    cost: ['seeds', 1e51],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'age',
      calc: () => Decimal.add(player.cell.amount, 10).log10().pow(temp.weathers[2]),
    }),
  },
  "S\\29": {
    get description() { return `<b>L10</b>'s effect's exponent is increased by Seeds.` },
    branch: ['S\\28'],

    cost: ['seeds', 1e55],

    effect: new Effect({
      type: EffectType.Exponent,
      static: false,
      calc: () => Decimal.div(player.seeds, 1e54).add(10).log10().root(4),
    }),
  },
  "S\\30": {
    get description() { return `Base Seed's Fertilizer scaling is divided by <b>3</b>.` },
    branch: ['S\\29'],

    cost: ['seeds', 1e64],
  },
  "S\\31": {
    get description() { return `<b>${formatMult(25)}</b> to Leaves, <b>${formatMult(5)}</b> to Seeds.` },
    branch: ['S\\30'],

    cost: ['seeds', 1e75],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 25,
    }),
  },
  "S\\32": {
    get description() { return `<b>${formatMult(5)}</b> to Leaves and Fruits.` },
    branch: ['S\\31'],

    cost: ['seeds', 1e95],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves', 'fruits'],
      calc: () => 5,
    }),
  },
  "S\\33": {
    get description() { return `<b>${formatMult(25)}</b> to Leaves, <b>${formatMult(5)}</b> to Seeds, <b>${formatMult(2)}</b> to Fruits.` },
    branch: ['S\\31'],

    cost: ['seeds', 1e150],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 25,
    }),
  },
  "S\\34": {
    get description() { return `<b>${formatMult(42)}</b> to Leaves, <b>${formatMult(5)}</b> to Tree aging speed.` },
    branch: ['S\\26'],

    cost: ['seeds', 1e85],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 42,
    }),
  },
  "S\\35": {
    get description() { return `<b>${formatMult(5)}</b> to Fruits, <b>${formatMult(1.2)}</b> to Entropy.` },
    branch: ['S\\27'],

    cost: ['seeds', 1e100],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'fruits',
      calc: () => 5,
    }),
  },
  "S\\36": {
    get description() { return `<b>S20</b>'s compounding effect is increased to <b>10%</b>.` },
    branch: ['S\\34'],

    cost: ['seeds', 1e115],
  },
  "S\\37": {
    get description() { return `<b>${formatMult(2)}</b> to Leaves, Seeds, Fruits, and Entropy.` },
    branch: ['S\\36'],

    cost: ['seeds', 1e125],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits','entropy'],
      calc: () => 2,
    }),
  },
  "S\\38": {
    get description() { return `Add <b>1</b> bonus Leaf Fertilizers per <b>4</b> Seed Fertilizers, starting at <b>50</b>.` },
    branch: ["S\\36"],

    cost: ['seeds', 1e145],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      group: 'fertilizers-0',
      calc: () => Decimal.sub(player.composter[1].fertilizers, 50).max(0).div(4),
    }),
  },
  "S\\39": {
    get description() { return `<b>${formatMult(1e4)}</b> to Leaves and Tree aging speed, <b>${formatMult(2)}</b> to Entropy.` },
    branch: ['S\\38'],

    cost: ['seeds', 1e196],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','age'],
      calc: () => 1e4,
    }),
  },
  "S\\40": {
    get description() { return `Bacteria slightly boosts Cell replication speed.` },
    branch: ['S\\38'],

    cost: ['seeds', 1e243],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'cell-speed',
      // eNum.bnumtostr(eNum.add(1, eNum.pow(2, eNum.UtilsLogx(s.Bacteria.Value, 1000))))
      // eNum.bnumtostr(eNum.add(1, eNum.mul("1e18000", eNum.pow(10, eNum.pow(eNum.UtilsLogx(s.Bacteria.Value, 10), 0.5)))))
      calc: () => softcap(Decimal.add(player.bacteria.amount, 1).root(10), '1e10000', 0.5, "E"),
    }),
  },
  "S\\41": {
    get description() { return `<b>${formatMult(25)}</b> to Leaves, Seeds, and Fruits.` },
    branch: ["S\\40"],

    cost: ['seeds', 1e270],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits'],
      calc: () => 25,
    }),
  },
  "S\\42": {
    get description() { return `<b>${formatMult(42)}</b> to Leaves, Seeds, Fruits, Tree aging speed, and Cell replication speed.` },
    branch: ["S\\38"],

    cost: ['seeds', 'e333'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits','age','cell-speed'],
      calc: () => 42,
    }),
  },
  "S\\43": {
    get description() { return `<b>${formatMult(20)}</b> to Leaves, Seeds, Fruits, and Tree aging speed, <b>${formatMult(2)}</b> to Entropy.` },
    branch: ["S\\42"],

    cost: ['seeds', 'e430'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits','age'],
      calc: () => 20,
    }),
  },
  "S\\44": {
    permanent: true,
    get description() { return `Unlock a new repeatable Seed upgrade permanently.` },
    branch: ["S\\42"],

    cost: ['seeds', 'e650'],
  },
  "S\\45": {
    get description() { return `<b>${formatMult(1e9)}</b> to Leaves and Tree aging speed.` },
    branch: ["S\\44"],

    cost: ['seeds', 'e800'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','age'],
      calc: () => 1e9,
    }),
  },
  "S\\46": {
    get description() { return `<b>${formatMult(2)}</b> to Roots.` },
    branch: ["S\\45"],

    cost: ['seeds', 'e3750'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'roots',
      calc: () => 2,
    }),
  },
  "S\\47": {
    get description() { return `The <b>LR2</b>'s level cap is increased by <b>LR1</b>'s level.` },
    branch: ["S\\46"],

    cost: ['seeds', 'e5000'],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.div(player.repeatable_upgrades['LR\\1'][0], 10),
    }),
  },
  "S\\48": {
    get description() { return `<b>${formatMult(5)}</b> to Heat and Ash.` },
    branch: ["S\\47"],

    cost: ['seeds', 'e6400'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['heat', 'ash'],
      calc: () => 5,
    }),
  },
  "S\\49": {
    get description() { return `<b>${formatMult(3)}</b> to Fallen Leaves.` },
    branch: ["S\\48"],

    cost: ['seeds', 'e13500'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fallen-0",
      calc: () => 3,
    }),
  },
  "S\\50": {
    get description() { return `<b>${formatMult(3)}</b> to Roots.` },
    branch: ["S\\49"],

    cost: ['seeds', 'e43000'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "roots",
      calc: () => 3,
    }),
  },
  "S\\51": {
    permanent: true,
    get description() { return `<b>${formatPow(3)}</b> to Virus permanently.` },
    branch: ["S\\50"],

    cost: ['seeds', 'e56000'],

    effect: new Effect({
      type: EffectType.Exponent,
      static: true,
      group: "virus",
      calc: () => 3,
    }),
  },
  "S\\52": {
    permanent: true,
    get description() { return `<b>${formatPow(2)}</b> to Virus permanently.` },
    branch: ["S\\51"],

    cost: ['seeds', 'e64000'],

    effect: new Effect({
      type: EffectType.Exponent,
      static: true,
      group: "virus",
      calc: () => 2,
    }),
  },
  //#endregion Seed

  //#region Fruit
  "F\\1": {
    condition: () => player.first.fruit,
    get description() { return `Unlock the Composter. <b>${formatMult(3)}</b> to Leaves.` },
    branch: [],

    cost: ['fruits', 1],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 3,
    }),
  },
  "F\\2": {
    get description() { return `Unlock the second Composter.` },
    branch: ["F\\1"],

    cost: ['fruits', 4],
  },
  "F\\3": {
    get description() { return `<b>${formatMult(5)}</b> to Leaves.` },
    branch: ["F\\2"],

    cost: ['fruits', 10],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 5,
    }),
  },
  "F\\4": {
    get description() { return `Leaves give a boost to Tree aging speed.` },
    branch: ["F\\2"],

    cost: ['fruits', 35],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'age',
      calc: () => hasUpgrade("RO\\12") ? expPow(Decimal.add(player.leaves, 1), .5) : Decimal.div(player.leaves, 1e18).add(10).log10(),
    }),
  },
  "F\\5": {
    get description() { return `<b>${formatMult(2.5)}</b> to Seeds.` },
    branch: ["F\\3"],

    cost: ['fruits', 15],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'seeds',
      calc: () => 2.5,
    }),
  },
  "F\\6": {
    get description() { return `Unlock the third Composter.` },
    branch: ["F\\3"],

    cost: ['fruits', 150],
  },
  "F\\7": {
    get description() { return `<b>${formatMult(2)}</b> to Fruits.` },
    branch: ["F\\3"],

    cost: ['fruits', 250],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'fruits',
      calc: () => 2,
    }),
  },
  "F\\8": {
    get description() { return `<b>${formatMult(2)}</b> to Tree aging speed.` },
    branch: ["F\\7"],

    cost: ['fruits', 400],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'age',
      calc: () => 2,
    }),
  },
  "F\\9": {
    get description() { return `<b>${formatMult(4)}</b> to Composting speed.` },
    branch: ["F\\8"],

    cost: ['fruits', 1e3],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'composting-speed',
      calc: () => 4,
    }),
  },
  "F\\10": {
    get description() { return `<b>${formatMult(3)}</b> to Seeds.` },
    branch: ["F\\8"],

    cost: ['fruits', 1500],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'seeds',
      calc: () => 3,
    }),
  },
  "F\\11": {
    get description() { return `<b>${formatMult(1.5)}</b> to Fruits.` },
    branch: ["F\\8"],

    cost: ['fruits', 2000],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'fruits',
      calc: () => 1.5,
    }),
  },
  "F\\12": {
    get description() { return `<b>${formatMult(3)}</b> to Tree aging speed.` },
    branch: ["F\\8"],

    cost: ['fruits', 7000],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'age',
      calc: () => 3,
    }),
  },
  "F\\13": {
    get description() { return `Leaves are increased by <b>${formatPercent(Decimal.sub(this.effect!.variables.base, 1))}</b> compounding per total fertilizer.` },
    branch: ["F\\6"],

    cost: ['fruits', 1e4],

    effect: new Effect({
      variables: {
        get base() { return Decimal.add(1.1, Effect.effect("upg-L\\41")) },
      },
      type: EffectType.Multiplier,
      static: false,
      group: 'leaves',
      calc() { return Decimal.pow(this.variables.base, temp.total_fertilizers) },
    }),
  },
  "F\\14": {
    get description() { return `<b>${formatMult(3)}</b> to Composting speed.` },
    branch: ["F\\12"],

    cost: ['fruits', 2.5e4],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'composting-speed',
      calc: () => 3,
    }),
  },
  "F\\15": {
    get description() { return `<b>${formatMult(3)}</b> to Tree aging speed.` },
    branch: ["F\\9"],

    cost: ['fruits', 7.5e4],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'age',
      calc: () => 3,
    }),
  },
  "F\\16": {
    get description() { return `<b>${formatMult(3)}</b> to Fruits.` },
    branch: ["F\\11"],

    cost: ['fruits', 1e5],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'fruits',
      calc: () => 3,
    }),
  },
  "F\\17": {
    get description() { return `<b>${formatMult(10)}</b> to Leaves.` },
    branch: ["F\\16"],

    cost: ['fruits', 4e5],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 10,
    }),
  },
  "F\\18": {
    permanent: true,
    get description() { return `Unlock a new Leaf upgrade permanently.` },
    branch: ["F\\12","F\\15"],

    cost: ['fruits', 7e5],
  },
  "F\\19": {
    get description() { return `<b>${formatMult(10)}</b> to Seeds.` },
    branch: ["F\\17"],

    cost: ['fruits', 5e7],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'seeds',
      calc: () => 10,
    }),
  },
  "F\\20": {
    priority: 1,
    get description() { return `<b>S8</b>'s effect's exponent is increased by Fruits.` },
    branch: ["F\\11"],

    cost: ['fruits', 1e13],

    effect: new Effect({
      type: EffectType.Exponent,
      static: false,
      calc: () => Decimal.add(player.fruits, 10).log10().cbrt(),
    }),
  },
  "F\\21": {
    get description() { return `<b>${formatPow(1.25)}</b> to static Fruit multiplier.` },
    branch: ["F\\20"],

    cost: ['fruits', 7.5e15],

    effect: new Effect({
      type: EffectType.BaseExponent,
      static: true,
      group: 'fruits',
      calc: () => 1.25,
    }),
  },
  "F\\22": {
    get description() { return `<b>${formatMult(25)}</b> to Composting speed.` },
    branch: ["F\\18"],

    cost: ['fruits', 5e16],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'composting-speed',
      calc: () => 25,
    }),
  },
  "F\\23": {
    get description() { return `<b>${formatMult(2)}</b> to L,S,F and <b>${formatMult(5)}</b> to Tree aging speed.` },
    branch: ["F\\21"],

    cost: ['fruits', 1.25e21],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits'],
      calc: () => 2,
    }),
  },
  "F\\24": {
    get description() { return `Fruits boost Seeds gain.` },
    branch: ["F\\23"],

    cost: ['fruits', 1e22],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'seeds',
      calc: () => expPow(Decimal.div(player.fruits, 1e22).add(1),0.5),
    }),
  },
  "F\\25": {
    get description() { return `<b>${formatMult(10)}</b> to Leaves and Seeds.` },
    branch: ["F\\24"],

    cost: ['fruits', 5e27],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds'],
      calc: () => 10,
    }),
  },
  "F\\26": {
    get description() { return `<b>${formatMult(3)}</b> to Leaves and Fruits, <b>${formatMult(100)}</b> to Composting speed.` },
    branch: ["F\\24"],

    cost: ['fruits', 2e33],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','fruits'],
      calc: () => 3,
    }),
  },
  "F\\27": {
    get description() { return `<b>${formatMult(15)}</b> to Leaves and Tree aging speed.` },
    branch: ["F\\24"],

    cost: ['fruits', 2e37],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','age'],
      calc: () => 15,
    }),
  },
  "F\\28": {
    get description() { return `<b>${formatMult(20)}</b> to Leaves, <b>${formatMult(5)}</b> to Seeds, <b>${formatMult(3)}</b> to Fruits and Tree aging speed.` },
    branch: ["F\\27"],

    cost: ['fruits', 1e46],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 20,
    }),
  },
  "F\\29": {
    get description() { return `Add <b>1</b> bonus Seed Fertilizers per <b>4</b> Fruit Fertilizers, starting at <b>50</b>.` },
    branch: ["F\\27"],

    cost: ['fruits', 1e61],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      group: 'fertilizers-1',
      calc: () => Decimal.sub(player.composter[2].fertilizers, 50).max(0).div(4),
    }),
  },
  "F\\30": {
    get description() { return `<b>${formatMult(10)}</b> to Leaves, Seeds, Fruits, and Cell replication speed.` },
    branch: ["F\\26"],

    cost: ['fruits', 1e89],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits','cell-speed'],
      calc: () => 10,
    }),
  },
  "F\\31": {
    get description() { return `<b>${formatMult(100)}</b> to Leaves and Tree aging speed, <b>${formatMult(2)}</b> to Entropy.` },
    branch: ["F\\30"],

    cost: ['fruits', 1e100],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','age'],
      calc: () => 100,
    }),
  },
  "F\\32": {
    get description() { return `<b>${formatMult(10)}</b> to Cell replication speed.` },
    branch: ["F\\31"],

    cost: ['fruits', 1e110],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'cell-speed',
      calc: () => 10,
    }),
  },
  "F\\33": {
    get description() { return `<b>${formatMult(2.75)}</b> to Entropy.` },
    branch: ["F\\32"],

    cost: ['fruits', 1.28e128],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'entropy',
      calc: () => 2.75,
    }),
  },
  "F\\34": {
    get description() { return `<b>${formatMult(3)}</b>E, <b>${formatMult(33)}</b>F, <b>${formatMult(333)}</b>S, <b>${formatMult(3333)}</b>L, <b>${formatMult(33333)}</b> to Tree aging speed.` },
    branch: ["F\\33"],

    cost: ['fruits', 1.41e141],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'entropy',
      calc: () => 3,
    }),
  },
  "F\\35": {
    get description() { return `<b>${formatMult(2.5)}</b> to Leaves, Seeds, Fruits, and Entropy.` },
    branch: ["F\\34"],

    cost: ['fruits', 1.65e165],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits','entropy'],
      calc: () => 2.5,
    }),
  },
  "F\\36": {
    get description() { return `Seeds are increased by <b>${formatPercent(Decimal.sub(this.effect!.variables.base, 1))}</b> compounding per total fertilizer.` },
    branch: ["F\\35"],

    cost: ['fruits', 1e240],

    effect: new Effect({
      variables: {
        get base() { return 1.05 },
      },
      type: EffectType.Multiplier,
      static: false,
      group: 'seeds',
      calc() { return Decimal.pow(this.variables.base, temp.total_fertilizers) },
    }),
  },
  "F\\37": {
    get description() { return `<b>${formatMult(10)}</b> to Leaves, Seeds, Fruits, and Tree aging speed, <b>${formatMult(2)}</b> to Entropy.` },
    branch: ["F\\36"],

    cost: ['fruits', 1e281],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits','age'],
      calc: () => 10,
    }),
  },
  "F\\38": {
    get description() { return `<b>${formatMult(1e9)}</b> to Leaves and Tree aging speed.` },
    branch: ["F\\35"],

    cost: ['fruits', 'e370'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','age'],
      calc: () => 1e9,
    }),
  },
  "F\\39": {
    get description() { return `<b>${formatMult(1e9)}</b> to Seeds and Fruits.` },
    branch: ["F\\38"],

    cost: ['fruits', 'e435'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['seeds','fruits'],
      calc: () => 1e9,
    }),
  },
  "F\\40": {
    get description() { return `<b>${formatMult(10)}</b> to Leaves, Seeds, and Fruits.` },
    branch: ["F\\39"],

    cost: ['fruits', 'e600'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits'],
      calc: () => 10,
    }),
  },
  "F\\41": {
    get description() { return `<b>${formatMult(10)}</b> to Leaves, Seeds, and Fruits.` },
    branch: ["F\\40"],

    cost: ['fruits', 'e625'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits'],
      calc: () => 10,
    }),
  },
  "F\\42": {
    get description() { return `<b>${formatMult(10)}</b> to Leaves, Seeds, and Fruits.` },
    branch: ["F\\41"],

    cost: ['fruits', 'e650'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits'],
      calc: () => 10,
    }),
  },
  "F\\43": {
    get description() { return `<b>${formatMult(10)}</b> to Leaves, Seeds, and Fruits.` },
    branch: ["F\\42"],

    cost: ['fruits', 'e675'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits'],
      calc: () => 10,
    }),
  },
  "F\\44": {
    get description() { return `<b>${formatMult(10)}</b> to Leaves, Seeds, and Fruits.` },
    branch: ["F\\43"],

    cost: ['fruits', 'e700'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits'],
      calc: () => 10,
    }),
  },
  "F\\45": {
    permanent: true,
    get description() { return `Unlock a new repeatable Fruit upgrade permanently.` },
    branch: ["F\\44"],

    cost: ['fruits', 'e750'],
  },
  "F\\46": {
    get description() { return `<b>${formatMult(1.75)}</b> to Roots.` },
    branch: ["F\\45"],

    cost: ['fruits', 'e2000'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'roots',
      calc: () => 1.75,
    }),
  },
  "F\\47": {
    get description() { return `<b>S20</b> is raised by Fruits.` },
    branch: ["F\\46"],

    cost: ['fruits', 'e2800'],

    effect: new Effect({
      type: EffectType.Exponent,
      static: false,
      calc: () => Decimal.add(player.fruits, 1).log10().div(1500).add(1),
    }),
  },
  "F\\48": {
    get description() { return `Fruits are increased by <b>${formatMult(1e10)}</b> per purchased upgrade, starting at <b>250</b>.` },
    branch: ["F\\46"],

    cost: ['fruits', 'e3200'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'fruits',
      calc: () => Decimal.sub(temp.purchasedUpgrades, 249).max(0).pow_base(1e10),
    }),
  },
  "F\\49": {
    get description() { return `<b>${formatMult(3)}</b> to Fallen Leaves.` },
    branch: ["F\\48"],

    cost: ['fruits', 'e8000'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fallen-0",
      calc: () => 3,
    }),
  },
  "F\\50": {
    get description() { return `<b>${formatMult(3)}</b> to Leaves falling speed.` },
    branch: ["F\\49"],

    cost: ['fruits', 'e18000'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fallen-speed",
      calc: () => 3,
    }),
  },
  "F\\51": {
    get description() { return `<b>${formatMult(20)}</b> to Leaves falling speed.` },
    branch: ["F\\50"],

    cost: ['fruits', 'e21000'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fallen-speed",
      calc: () => 20,
    }),
  },
  "F\\52": {
    permanent: true,
    get description() { return `<b>${formatPow(3)}</b> to Virus permanently.` },
    branch: ["F\\51"],

    cost: ['fruits', 'e28000'],

    effect: new Effect({
      type: EffectType.Exponent,
      static: true,
      group: "virus",
      calc: () => 3,
    }),
  },
  "F\\53": {
    permanent: true,
    get description() { return `<b>${formatPow(2)}</b> to Virus permanently.` },
    branch: ["F\\52"],

    cost: ['fruits', 'e35000'],

    effect: new Effect({
      type: EffectType.Exponent,
      static: true,
      group: "virus",
      calc: () => 2,
    }),
  },
  //#endregion

  //#region Entropy
  "E\\1": {
    condition: () => player.first.entropy,
    permanent: true,
    get description() { return `Unlock the <b>Cellular Lab</b> permanently.` },
    branch: [],

    cost: ['entropy', 1],
  },
  "E\\2": {
    get description() { return `<b>${formatPow(1.5)}</b> to static Leaf multiplier.` },
    branch: ["E\\1"],

    cost: ['entropy', 1],

    effect: new Effect({
      type: EffectType.BaseExponent,
      static: true,
      group: 'leaves',
      calc: () => 1.5,
    }),
  },
  "E\\3": {
    get description() { return `Keep <b>S20</b> on Harvest and Transform.` },
    branch: ["E\\1"],

    cost: ['entropy', 1],

    onbuy() {
      if (player.discovered_upgrades["S\\20"]) player.upgrades["S\\20"] = true;
    },
  },
  "E\\4": {
    get description() { return `Fruits boost themselves.` },
    branch: ["E\\1"],

    cost: ['entropy', 1],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'fruits',
      calc: () => Decimal.div(player.fruits, 10).add(10).log10().pow(temp.weathers[1]).pow(Effect.effect("upg-E\\33")),
    }),
  },
  "E\\5": {
    get description() { return `Start with the first 3 Composters unlocked on Transform.` },
    branch: ["E\\1"],

    cost: ['entropy', 2],
    nospend: true,

    onbuy() {
      if (player.discovered_upgrades["F\\1"]) player.upgrades["F\\1"] = true;
      if (player.discovered_upgrades["F\\2"]) player.upgrades["F\\2"] = true;
      if (player.discovered_upgrades["F\\6"]) player.upgrades["F\\6"] = true;
    },
  },
  "E\\6": {
    get description() { return `Fertilizers boost Composting speed at a reduced rate.` },
    branch: ["E\\4"],

    cost: ['entropy', 3],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'composting-speed',
      calc: () => Decimal.pow(1.1, temp.total_fertilizers),
    }),
  },
  "E\\7": {
    get description() { return `<b>L16</b>'s effect's exponent is increased by Entropy.` },
    branch: ["E\\2","E\\3"],

    cost: ['entropy', 5],

    effect: new Effect({
      type: EffectType.Exponent,
      static: false,
      calc: () => Decimal.add(player.entropy, 1).log2().mul(.1).add(1.2),
    }),
  },
  "E\\8": {
    get description() { return `The Leaf and Seed Composters no longer reset on Harvest.` },
    branch: ["E\\5"],

    cost: ['entropy', 10],
    nospend: true,
  },
  "E\\9": {
    priority: 2,
    get description() { return `<b>L9</b>'s compounding effect is increased by Fruits.` },
    branch: ["E\\7"],

    cost: ['entropy', 7],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.add(player.fruits, 1).log10().div(200),
      display: x => "+"+formatPercent(x),
    }),
  },
  "E\\10": {
    get description() { return `Scaled Fertilizers start later by Entropy.` },
    branch: ["E\\7"],

    cost: ['entropy', 15],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => softcap(Decimal.add(player.entropy, 1).log10(), 100, .5, "P"),
    }),
  },
  "E\\11": {
    priority: 1,
    get description() { return `Improve Cell's effects.` },
    branch: ["E\\10"],

    cost: ['entropy', 30],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.div(player.cell.amount, 1e80).add(1).root(30),
    }),
  },
  "E\\12": {
    get description() { return `Keep Cells on Transform.` },
    branch: ["E\\8"],

    cost: ['entropy', 42],
    nospend: true,
  },
  "E\\13": {
    priority: 1,
    get description() { return `Replicate interval is divided by Entropy.` },
    branch: ["E\\11"],

    cost: ['entropy', 200],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: "cell-speed",
      calc: () => expPow(Decimal.add(player.entropy, 1), .5).sqrt(),
    }),
  },
  "E\\14": {
    get description() { return `<b>${formatMult(5e4)}</b> to Leaves.` },
    branch: ["E\\13"],

    cost: ['entropy', 2e3],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "leaves",
      calc: () => 5e4,
    }),
  },
  "E\\15": {
    get description() { return `<b>${formatMult(500)}</b> to Seeds.` },
    branch: ["E\\13"],

    cost: ['entropy', 2e3],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "seeds",
      calc: () => 500,
    }),
  },
  "E\\16": {
    get description() { return `<b>${formatMult(50)}</b> to Fruits.` },
    branch: ["E\\13"],

    cost: ['entropy', 2e3],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fruits",
      calc: () => 50,
    }),
  },
  "E\\17": {
    get description() { return `<b>${formatMult(1.5)}</b> to Entropy.` },
    branch: ["E\\13"],

    cost: ['entropy', 2e3],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "entropy",
      calc: () => 1.5,
    }),
  },
  "E\\18": {
    get description() { return `Unlock a new upgrade in cells tab.` },
    branch: ["E\\11"],

    cost: ['entropy', 1e4],
  },
  "E\\19": {
    get description() { return `Transform gives twice as much entropy.` },
    branch: ["E\\18"],

    cost: ['entropy', 2e4],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "entropy",
      calc: () => 2,
    }),
  },
  "E\\20": {
    get description() { return `The 2nd Cell upgrade gain a bonus level per the 3rd Cell upgrade.` },
    branch: ["E\\18"],

    cost: ['entropy', 2e5],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => player.big_upgrades['cell\\3'],
    }),
  },
  "E\\21": {
    permanent: true,
    get description() { return `You can produce as much fertilizer as resources allow and as composting speed increases.` },
    branch: ["E\\17"],

    cost: ['entropy', 1e4],
  },
  "E\\22": {
    permanent: true,
    get description() { return `Unlock the <b>Weather Forecast building</b> (in <b>Challenges</b> tab) permanently.` },
    branch: ["E\\20"],

    cost: ['entropy', 1.5e7],
  },
  "E\\23": {
    get description() { return `Cell replication decrease is weaker.` },
    branch: ["E\\18"],

    cost: ['entropy', 1e8],
  },
  "E\\24": {
    get description() { return `<b>${formatMult(25)}</b> to Leaves, Seeds, Fruits, and Tree aging speed.` },
    branch: ["E\\18"],

    cost: ['entropy', 3e8],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['leaves','seeds','fruits','age'],
      calc: () => 25,
    }),
  },
  "E\\25": {
    get description() { return `Storm reward affects Seeds at a reduced rate.` },
    branch: ["E\\21"],

    cost: ['entropy', 5e9],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'seeds',
      calc: () => Decimal.root(temp.weathers[0], 3),
    }),
  },
  "E\\26": {
    get description() { return `Keep <b>1%</b> of your Entropy on Bacteria.` },
    branch: ["E\\24"],

    nospend: true,
    cost: ['entropy', 1e10],
  },
  "E\\27": {
    get description() { return `<b>${formatPow(1.1)}</b> to Bacteria.` },
    branch: ["E\\25"],

    cost: ['entropy', 2e10],

    effect: new Effect({
      type: EffectType.Exponent,
      static: true,
      group: 'bacteria',
      calc: () => 1.1,
    }),
  },
  "E\\28": {
    get description() { return `<b>${formatMult(5e4)}</b> to Leaves.` },
    branch: ["E\\27"],

    cost: ['entropy', 2e12],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'leaves',
      calc: () => 5e4,
    }),
  },
  "E\\29": {
    get description() { return `Superscaled Fertilizers are <b>10%</b> weaker.` },
    branch: ["E\\27"],

    cost: ['entropy', 8e12],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      calc: () => .9,
    }),
  },
  "E\\30": {
    get description() { return `<b>+15</b> to <b>LR1</b>'s level cap.` },
    branch: ["E\\29"],

    cost: ['entropy', 3e14],

    effect: new Effect({
      type: EffectType.Addition,
      static: true,
      calc: () => 15,
    }),
  },
  "E\\31": {
    get description() { return `<b>${formatMult(1e3)}</b> to Seeds.` },
    branch: ["E\\29"],

    cost: ['entropy', 5e15],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'seeds',
      calc: () => 1e3,
    }),
  },
  "E\\32": {
    get description() { return `The <b>LR1</b>'s base is increased by Entropy.` },
    branch: ["E\\30"],

    cost: ['entropy', 3e16],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.div(player.entropy, 1e12).add(1).log10(),
    }),
  },
  "E\\33": {
    priority: 1,
    get description() { return `<b>E4</b>'s effect's exponent is increased by Leaves.` },
    branch: ["E\\32"],

    cost: ['entropy', 3e17],

    effect: new Effect({
      type: EffectType.Exponent,
      static: false,
      calc: () => softcap(Decimal.add(player.leaves, 1).log10().div(100).root(2).add(1), 10, 1, "LOG"),
    }),
  },
  "E\\34": {
    get description() { return `The <b>LR1</b>'s cost scaling is weaker.` },
    branch: ["E\\30"],

    cost: ['entropy', 1e18],

    effect: new Effect({
      type: EffectType.Addition,
      static: true,
      calc: () => 15,
    }),
  },
  "E\\35": {
    get description() { return `<b>+10</b> to <b>LR1</b>'s level cap.` },
    branch: ["E\\34"],

    cost: ['entropy', 2.5e18],

    effect: new Effect({
      type: EffectType.Addition,
      static: true,
      calc: () => 10,
    }),
  },
  "E\\36": {
    get description() { return `Bacteria limit is increased by Entropy linearly.` },
    branch: ["E\\35"],

    cost: ['entropy', 2e21],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: "bacteria-limit",
      calc: () => Decimal.add(player.entropy, 1),
    }),
  },
  "E\\37": {
    get description() { return `Storm reward affects Fruits at a reduced rate.` },
    branch: ["E\\36"],

    cost: ['entropy', 1e25],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'fruits',
      calc: () => Decimal.root(temp.weathers[0], 10),
    }),
  },
  "E\\38": {
    get description() { return `Superscaled Fertilizers are <b>10%</b> weaker again.` },
    branch: ["E\\37"],

    cost: ['entropy', 1e28],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      calc: () => .9,
    }),
  },
  "E\\39": {
    get description() { return `<b>+15</b> to <b>SR1</b>'s level cap.` },
    branch: ["E\\38"],

    cost: ['entropy', 1e33],

    effect: new Effect({
      type: EffectType.Addition,
      static: true,
      calc: () => 15,
    }),
  },
  "E\\40": {
    get description() { return `<b>${formatMult(1.15)}</b> to Roots.` },
    branch: ["E\\39"],

    cost: ['entropy', 1e36],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "roots",
      calc: () => 1.15,
    }),
  },
  "E\\41": {
    get description() { return `The <b>SR1</b>'s base is increased by <b>FR1</b>'s level.` },
    branch: ["E\\40"],

    cost: ['entropy', 1e39],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.root(player.repeatable_upgrades["FR\\1"][0], 2),
    }),
  },
  "E\\42": {
    get description() { return `The first Cell upgrade is exponentially stronger.` },
    branch: ["E\\41"],

    cost: ['entropy', 1e42],
  },
  "E\\43": {
    get description() { return `Fruits divide <b>LR1</b>'s cost.` },
    branch: ["E\\42"],

    cost: ['entropy', 2e46],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.max(player.fruits, 1).pow(-1),
    }),
  },
  "E\\44": {
    get description() { return `The <b>FR1</b>'s level cap is increased by <b>LR1</b>'s level.` },
    branch: ["E\\43"],

    cost: ['entropy', 1e48],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.div(player.repeatable_upgrades["LR\\1"][0], 10).add(1),
    }),
  },
  "E\\45": {
    get description() { return `Fruits<sup>0.5</sup> divide <b>SR1</b>'s cost.` },
    branch: ["E\\42"],

    cost: ['entropy', 1e54],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.max(player.fruits, 1).root(-2),
    }),
  },
  "E\\46": {
    get description() { return `Fruits<sup>0.15</sup> divide <b>FR1</b>'s cost.` },
    branch: ["E\\45"],

    cost: ['entropy', 1e60],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.max(player.fruits, 1).pow(-.15),
    }),
  },
  "E\\47": {
    get description() { return `The <b>FR1</b>'s level cap is increased by total Roots.` },
    branch: ["E\\45"],

    cost: ['entropy', 1e63],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.add(player.root.total, 1).log2().add(1),
    }),
  },
  "E\\48": {
    get description() { return `Composting speed divides the first 3 Fertilizers' cost.` },
    branch: ["E\\44"],

    cost: ['entropy', 1e79],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.max(temp.compostingSpeed, 1).pow(-1),
    }),
  },
  "E\\49": {
    get description() { return `<b>${formatMult(1.5)}</b> to Roots.` },
    branch: ["E\\48"],

    cost: ['entropy', 1e83],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "roots",
      calc: () => 1.5,
    }),
  },
  "E\\50": {
    get description() { return `Entropy increases the exponent of Roots gain formula.` },
    branch: ["E\\49"],

    cost: ['entropy', 1e100],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.div(player.entropy, 1e100).add(1).log10().div(50).root(2).add(.01),
    }),
  },
  "E\\51": {
    get description() { return `The <b>FR1</b>'s base is increased by Ash.` },
    branch: ["E\\49"],

    cost: ['entropy', 1e112],

    effect: new Effect({
      type: EffectType.Exponent,
      static: false,
      calc: () => Decimal.add(player.furnace.ash, 1).log10().div(1e3).root(2).div(1.5).add(1),
    }),
  },
  "E\\52": {
    get description() { return `Tree age slowdown is <b>25%</b> weaker.` },
    branch: ["E\\50"],

    cost: ['entropy', 1e121],
  },
  "E\\53": {
    permanent: true,
    get description() { return `Unlock a new repeatable Entropy upgrade permanently.` },
    branch: ["E\\47"],

    cost: ['entropy', 1e150],
  },
  "E\\54": {
    get description() { return `Add <b>1</b> bonus of first 3 Fertilizers per <b>2</b> Entropy Fertilizers.` },
    branch: ["E\\48"],

    cost: ['entropy', 1e165],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      group: ['fertilizers-0','fertilizers-1','fertilizers-2'],
      calc: () => Decimal.div(player.composter[3].fertilizers, 2),
    }),
  },
  "E\\55": {
    get description() { return `Entropy boosts Roots.` },
    branch: ["E\\50"],

    cost: ['entropy', 1e175],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'roots',
      calc: () => Decimal.div(player.entropy, 1e100).add(10).log10().root(2),
    }),
  },
  "E\\56": {
    get description() { return `The <b>FR1</b>'s level cap is increased by Fallen Leaves.` },
    branch: ["E\\51"],

    cost: ['entropy', 1e200],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.add(player.fallen[0], 10).log10().root(1.5).mul(3).add(1),
    }),
  },
  "E\\57": {
    get description() { return `The <b>FR2</b>'s effect<sup>0.05</sup> divides Entropy Fertilizer's cost.` },
    branch: ["E\\54"],

    cost: ['entropy', 1e250],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.pow(Effect.effect("rupg-FR\\2"), .05),
    }),
  },
  "E\\58": {
    get description() { return `The <b>ER1</b>'s base is increased by total Roots.` },
    branch: ["E\\53"],

    cost: ['entropy', 1e285],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.add(player.root.total, 1).root(3),
    }),
  },
  "E\\59": {
    get description() { return `The <b>LR2</b> and <b>SR2</b>' level cap is increased by Fallen Leaves.` },
    branch: ["E\\53"],

    cost: ['entropy', DC.DE308],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.add(player.fallen[0], 1).log10(),
    }),
  },
  "E\\60": {
    get description() { return `The <b>ER1</b>' level cap is increased by <b>SR2</b>'s level.` },
    branch: ["E\\59"],

    cost: ['entropy', 'e380'],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.div(player.repeatable_upgrades['SR\\2'][0], 2).add(1),
    }),
  },
  "E\\61": {
    get description() { return `<b>SR2</b> divides itself.` },
    branch: ["E\\59"],

    cost: ['entropy', 'e470'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Effect.effect("rupg-SR\\2"),
    }),
  },
  "E\\62": {
    get description() { return `The <b>SR1</b> and <b>ER1</b>' level cap is increased by Leaves falling speed.` },
    branch: ["E\\60"],

    cost: ['entropy', 'e560'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.add(temp.fallen_speed, 1).log(1000).root(2).add(1),
    }),
  },
  "E\\63": {
    get description() { return `<b>^1.15</b> to <b>LR1</b>, <b>SR1</b>, and <b>FR1</b>' base.` },
    branch: ["E\\61"],

    cost: ['entropy', 'e610'],

    effect: new Effect({
      type: EffectType.Exponent,
      static: true,
      calc: () => 1.15,
    }),
  },
  "E\\64": {
    get description() { return `The <b>FR2</b>'s level cap is increased by Bacteria.` },
    branch: ["E\\63"],

    cost: ['entropy', 'e730'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.add(player.bacteria.amount, 10).log10().log(1e4).add(1),
    }),
  },
  "E\\65": {
    get description() { return `Roots divide <b>ROR1</b>'s cost scaling.` },
    branch: ["E\\63"],

    cost: ['entropy', 'e760'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.add(player.root.amount, 10).log10().root(-2),
    }),
  },
  "E\\66": {
    get description() { return `The <b>LR2</b>'s base is increased by <b>LR2</b>'s level.` },
    branch: ["E\\65"],

    cost: ['entropy', 'e900'],

    effect: new Effect({
      type: EffectType.Exponent,
      static: false,
      calc: () => Decimal.div(player.repeatable_upgrades['LR\\2'][0], 40).add(1),
    }),
  },
  "E\\67": {
    get description() { return `Entropy<sup>0.5</sup> boosts Tree aging speed.` },
    branch: ["E\\66"],

    cost: ['entropy', 'e1100'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: "age",
      calc: () => Decimal.add(player.entropy, 1).root(2),
    }),
  },
  "E\\68": {
    get description() { return `<b>${formatMult(6)}</b> to Basket cap.` },
    branch: ["E\\42"],

    cost: ['entropy', 'e1500'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fallen-basket",
      calc: () => 6,
    }),
  },
  "E\\69": {
    permanent: true,
    get description() { return `Entropy boosts Beneficial Virus permanently.` },
    branch: ["E\\67"],

    cost: ['entropy', 'e2400'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: "BV",
      calc: () => Decimal.add(player.entropy, 1).log10().div(50).add(1),
    }),
  },
  //#endregion
  //#region Roots
  "RO\\1": {
    condition: () => player.first.root,
    permanent: true,
    get description() { return `Unlock new Leaf upgrades permanently.` },
    branch: [],

    cost: ['roots', 1],
  },
  "RO\\M1": {
    permanent: true,
    get description() { return `Unlock <b>Auto-Entropy Upgrades</b> permanently.` },
    branch: ["RO\\1"],

    nospend: true,
    cost: ['total-roots', 2],
  },
  "RO\\M2": {
    get description() { return `<b>Composting Automation</b> applies to the fourth Composter.` },
    branch: ["RO\\M1"],

    nospend: true,
    cost: ['total-roots', 5],
  },
  "RO\\M3": {
    permanent: true,
    get description() { return `Unlock <b>Auto-Cell Upgrades</b> permanently.` },
    branch: ["RO\\M2"],

    nospend: true,
    cost: ['total-roots', 10],
  },
  "RO\\M4": {
    get description() { return `<b>${formatMult(3)}</b> to Entropy. Start with <b>${format(DC.DE308)}</b> Cells and <b>1</b> Bacteria Type on Reinforcement.` },
    branch: ["RO\\M3"],

    nospend: true,
    cost: ['total-roots', 20],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'entropy',
      calc: () => 3,
    }),
  },
  "RO\\M5": {
    get description() { return `Weather goals no longer reset on Reinforcement.` },
    branch: ["RO\\M4"],

    nospend: true,
    cost: ['total-roots', 50],
  },
  "RO\\M6": {
    permanent: true,
    get description() { return `Unlock <b>Auto-Bacteria Upgrades</b> permanently.` },
    branch: ["RO\\M5"],

    nospend: true,
    cost: ['total-roots', 100],
  },
  "RO\\M7": {
    permanent: true,
    get description() { return `Passively generate <b>100%</b> of your pending Bacteria permanently.` },
    branch: ["RO\\M6"],

    nospend: true,
    cost: ['total-roots', 200],
  },
  "RO\\M8": {
    get description() { return `Cells can now exceed their limit, so Bacteria Types are automatically gained.` },
    branch: ["RO\\M7"],

    nospend: true,
    cost: ['total-roots', 500],
  },
  "RO\\M9": {
    get description() { return `Coal doesn't reset on Reinforcement.` },
    branch: ["RO\\M8"],

    nospend: true,
    cost: ['total-roots', 1e7],
  },
  "RO\\M10": {
    permanent: true,
    get description() { return `Passively generate <b>100%</b> of your pending Entropy permanently.` },
    branch: ["RO\\M9"],

    nospend: true,
    cost: ['total-roots', 1e9],
  },

  "RO\\2": {
    get description() { return `<b>LR1</b>'s initial cost is lowered to <b>1</b>, and its level cap is increased by Entropy.` },
    branch: ["RO\\1"],

    nospend: true,
    cost: ['total-roots', 1],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.max(player.entropy, 1).log10(),
    }),
  },
  "RO\\3": {
    get description() { return `Unlock the fourth Composter.` },
    branch: ["RO\\1"],

    nospend: true,
    cost: ['total-roots', 1],
  },
  "RO\\4": {
    get description() { return `<b>SR1</b>'s initial cost is lowered to <b>1</b>, and its level cap is increased by total Roots. <i><b>${formatMult(1.5)}</b> to cost of <b>RO4-7</b> (floored).</i>` },
    branch: ["RO\\1"],

    get cost () { return ['roots', Math.floor(1.5 ** (+hasUpgrade("RO\\5")+ +hasUpgrade("RO\\6")+ +hasUpgrade("RO\\7")))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.add(player.root.total, 1).log10().root(1.75).add(1.5),
    }),
  },
  "RO\\5": {
    get description() { return `<b>${formatMult(10)}</b> to Bactieria replication speed, and its limit is raised by total Roots. <i><b>${formatMult(1.5)}</b> to cost of <b>RO4-7</b> (floored).</i>` },
    branch: ["RO\\1"],

    get cost () { return ['roots', Math.floor(1.5 ** (+hasUpgrade("RO\\4")+ +hasUpgrade("RO\\6")+ +hasUpgrade("RO\\7")))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Exponent,
      static: false,
      group: "bacteria-limit",
      calc: () => Decimal.add(player.root.total, 1).log(30).add(1),
    }),
  },
  "RO\\6": {
    get description() { return `<b>${formatPow(1.05)}</b> to Leaves. <i><b>${formatMult(1.5)}</b> to cost of <b>RO4-7</b> (floored).</i>` },
    branch: ["RO\\2"],

    get cost () { return ['roots', Math.floor(1.5 ** (+hasUpgrade("RO\\5")+ +hasUpgrade("RO\\4")+ +hasUpgrade("RO\\7")))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Exponent,
      static: true,
      group: 'leaves',
      calc: () => 1.05,
    }),
  },
  "RO\\7": {
    get description() { return `Entropy boosts itself logarithmically. <i><b>${formatMult(1.5)}</b> to cost of <b>RO4-7</b> (floored).</i>` },
    branch: ["RO\\2"],

    get cost () { return ['roots', Math.floor(1.5 ** (+hasUpgrade("RO\\5")+ +hasUpgrade("RO\\6")+ +hasUpgrade("RO\\4")))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'entropy',
      calc: () => Decimal.add(player.entropy, 10).log10(),
    }),
  },
  "RO\\8": {
    get description() { return `Superscaled Fertilizers are delayed by total Roots.` },
    branch: ["RO\\4","RO\\5"],

    cost: ['roots', 4],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.add(player.root.total, 1).log(1.25),
    }),
  },
  "RO\\9": {
    get description() { return `<b>${formatPow(1.5)}</b> to static TAS multiplier.` },
    branch: ["RO\\6","RO\\7"],

    cost: ['roots', 5],

    effect: new Effect({
      type: EffectType.BaseExponent,
      static: true,
      group: "age",
      calc: () => 1.5,
    }),
  },
  "RO\\10": {
    get description() { return `<b>LR1</b>'s level cap is increased by total Roots.` },
    branch: ["RO\\8"],

    cost: ['roots', 5],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.add(player.root.total, 1).log(1.2).add(5),
    }),
  },
  "RO\\11": {
    get description() { return `Divide <b>LR1</b>, <b>SR1</b>, and <b>FR1</b>' cost scaling by <b>10</b>.` },
    branch: ["RO\\9"],

    cost: ['roots', 7],
  },
  "RO\\12": {
    get description() { return `Improve <b>F4</b>'s effect.` },
    branch: ["RO\\10"],

    cost: ['roots', 8],
  },
  "RO\\13": {
    get description() { return `Leaves increase the exponent of Roots gain formula.` },
    branch: ["RO\\11"],

    cost: ['roots', 9],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.add(player.leaves, 1).log10().div(3000).root(2),
    }),
  },
  "RO\\14": {
    get description() { return `<b>${formatMult(50)}</b> to Entropy.` },
    branch: ["RO\\11"],

    cost: ['roots', 13],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "entropy",
      calc: () => 50,
    }),
  },
  "RO\\15": {
    permanent: true,
    get description() { return `Unlock <b>the Incinerator</b> permanently.` },
    branch: ["RO\\12"],

    cost: ['roots', 20],
  },
  "RO\\16": {
    get description() { return `Unlock the third Bacteria upgrade.` },
    branch: ["RO\\12"],

    cost: ['roots', 25],
  },
  "RO\\17": {
    get description() { return `<b>${formatMult(1e33)}</b> to Leaves. <i><b>${formatMult(2)}</b> to cost of <b>RO17-20</b>.</i>` },
    branch: ["RO\\10"],

    get cost () { return ['roots', 22 * Math.floor(2 ** (+hasUpgrade("RO\\18")+ +hasUpgrade("RO\\19")+ +hasUpgrade("RO\\20")))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "leaves",
      calc: () => 1e33,
    }),
  },
  "RO\\18": {
    get description() { return `<b>${formatMult(1e18)}</b> to Seeds. <i><b>${formatMult(2)}</b> to cost of <b>RO17-20</b>.</i>` },
    branch: ["RO\\10"],

    get cost () { return ['roots', 22 * Math.floor(2 ** (+hasUpgrade("RO\\17")+ +hasUpgrade("RO\\19")+ +hasUpgrade("RO\\20")))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "seeds",
      calc: () => 1e18,
    }),
  },
  "RO\\19": {
    get description() { return `<b>${formatMult(1e10)}</b> to Fruits. <i><b>${formatMult(2)}</b> to cost of <b>RO17-20</b>.</i>` },
    branch: ["RO\\13"],

    get cost () { return ['roots', 22 * Math.floor(2 ** (+hasUpgrade("RO\\18")+ +hasUpgrade("RO\\17")+ +hasUpgrade("RO\\20")))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fruits",
      calc: () => 1e10,
    }),
  },
  "RO\\20": {
    get description() { return `<b>${formatMult(100)}</b> to Entropy. <i><b>${formatMult(2)}</b> to cost of <b>RO17-20</b>.</i>` },
    branch: ["RO\\13"],

    get cost () { return ['roots', 22 * Math.floor(2 ** (+hasUpgrade("RO\\18")+ +hasUpgrade("RO\\19")+ +hasUpgrade("RO\\17")))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "entropy",
      calc: () => 100,
    }),
  },
  "RO\\21": {
    get description() { return `<b>${formatMult(1.75)}</b> to Roots.` },
    branch: ["RO\\13"],

    cost: ['roots', 50],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "roots",
      calc: () => 1.75,
    }),
  },
  "RO\\22": {
    get description() { return `<b>${formatMult(2)}</b> to Entropy.` },
    branch: ["RO\\15"],

    cost: ['roots', 500],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "entropy",
      calc: () => 2,
    }),
  },
  "RO\\23": {
    get description() { return `Total Roots boost the first Bacteria effect at an extremely reduced rate.` },
    branch: ["RO\\15"],

    cost: ['roots', 500],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.add(player.root.total, 10).log10().log10().div(5).add(1),
    }),
  },
  "RO\\24": {
    get description() { return `<b>${formatPow(1.02)}</b> to Leaves. <i><b>${formatMult(10)}</b> to cost of <b>RO24-26</b>.</i>` },
    branch: ["RO\\15"],

    get cost () { return ['roots', 750 * 10 ** (+hasUpgrade("RO\\25")+ +hasUpgrade("RO\\26"))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Exponent,
      static: true,
      group: "leaves",
      calc: () => 1.02,
    }),
  },
  "RO\\25": {
    get description() { return `<b>${formatPow(1.02)}</b> to Seeds. <i><b>${formatMult(10)}</b> to cost of <b>RO24-26</b>.</i>` },
    branch: ["RO\\15"],

    get cost () { return ['roots', 750 * 10 ** (+hasUpgrade("RO\\24")+ +hasUpgrade("RO\\26"))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Exponent,
      static: true,
      group: "seeds",
      calc: () => 1.02,
    }),
  },
  "RO\\26": {
    get description() { return `<b>${formatPow(1.02)}</b> to Fruits. <i><b>${formatMult(10)}</b> to cost of <b>RO24-26</b>.</i>` },
    branch: ["RO\\15"],

    get cost () { return ['roots', 750 * 10 ** (+hasUpgrade("RO\\25")+ +hasUpgrade("RO\\24"))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Exponent,
      static: true,
      group: "fruits",
      calc: () => 1.02,
    }),
  },
  "RO\\27": {
    condition: () => player.discovered_upgrades['RO\\24'] || player.discovered_upgrades['RO\\25'] || player.discovered_upgrades['RO\\26'],
    get description() { return `<b>${formatMult(1.5)}</b> to Roots.` },
    branch: [],

    cost: ['roots', 3500],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "roots",
      calc: () => 1.5,
    }),
  },
  "RO\\28": {
    get description() { return `Increase Incinerator's maximum input by <b>5</b>.` },
    branch: ["RO\\15"],

    cost: ['roots', 300],

    effect: new Effect({
      type: EffectType.Addition,
      static: true,
      calc: () => 5,
    }),
  },
  "RO\\29": {
    get description() { return `You can incinerate Seeds.` },
    branch: ["RO\\28"],

    cost: ['roots', 7500],
  },
  "RO\\30": {
    get description() { return `<b>${formatMult(1e100)}</b> to Leaves. <i>I don't care about that Infinistal's warning about static multiplier.</i>` },
    branch: ["RO\\24"],

    cost: ['roots', 15000],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "leaves",
      calc: () => 1e100,
    }),
  },
  "RO\\31": {
    get description() { return `Total Roots<sup>15</sup> boost Leaves. <i><b>${formatMult(3)}</b> to cost of <b>RO31-34</b>.</i>` },
    branch: ["RO\\17"],

    get cost () { return ['roots', 3e4 * 3 ** (+hasUpgrade("RO\\32")+ +hasUpgrade("RO\\33")+ +hasUpgrade("RO\\34"))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: "leaves",
      calc: () => Decimal.add(player.root.total, 1).pow(15),
    }),
  },
  "RO\\32": {
    get description() { return `Total Roots<sup>10</sup> boost Seeds. <i><b>${formatMult(3)}</b> to cost of <b>RO31-34</b>.</i>` },
    branch: ["RO\\18"],

    get cost () { return ['roots', 3e4 * 3 ** (+hasUpgrade("RO\\31")+ +hasUpgrade("RO\\33")+ +hasUpgrade("RO\\34"))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: "seeds",
      calc: () => Decimal.add(player.root.total, 1).pow(10),
    }),
  },
  "RO\\33": {
    get description() { return `Total Roots<sup>7</sup> boost Fruits. <i><b>${formatMult(3)}</b> to cost of <b>RO31-34</b>.</i>` },
    branch: ["RO\\19"],

    get cost () { return ['roots', 3e4 * 3 ** (+hasUpgrade("RO\\32")+ +hasUpgrade("RO\\31")+ +hasUpgrade("RO\\34"))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: "fruits",
      calc: () => Decimal.add(player.root.total, 1).pow(7),
    }),
  },
  "RO\\34": {
    get description() { return `Total Roots<sup>1.5</sup> boost Entropy. <i><b>${formatMult(3)}</b> to cost of <b>RO31-34</b>.</i>` },
    branch: ["RO\\20"],

    get cost () { return ['roots', 3e4 * 3 ** (+hasUpgrade("RO\\32")+ +hasUpgrade("RO\\33")+ +hasUpgrade("RO\\31"))] as [string, DecimalSource] },

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: "entropy",
      calc: () => Decimal.add(player.root.total, 1).pow(1.5),
    }),
  },
  "RO\\35": {
    permanent: true,
    get description() { return `Unlock <b>the Furnace</b> permanently.` },
    branch: ["RO\\27"],

    cost: ['roots', 150000],
  },
  "RO\\36": {
    get description() { return `Superscaled Fertilizers are delayed by <b>FR1</b>'s level.` },
    branch: ["RO\\29"],

    cost: ['roots', 2.5e6],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.mul(player.repeatable_upgrades["FR\\1"][0], 2),
    }),
  },
  "RO\\37": {
    get description() { return `Cells weaken Bacteria's limit slowdown.` },
    branch: ["RO\\30"],

    cost: ['roots', 5e6],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.max(player.cell.amount, 10).log10().log10().div(50).add(1).root(-2),
    }),
  },
  "RO\\38": {
    get description() { return `Incinerator's maximum input is increased by total Roots.` },
    branch: ["RO\\29"],

    cost: ['roots', 8e6],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => Decimal.div(player.root.total, 100).add(1).log(100).add(1),
    }),
  },
  "RO\\39": {
    get description() { return `Total Roots boost Ash.` },
    branch: ["RO\\37"],

    cost: ['roots', 2e7],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'ash',
      calc: () => Decimal.add(player.root.total, 1).root(2),
    }),
  },
  "RO\\40": {
    get description() { return `You can incinerate Leaves.` },
    branch: ["RO\\29"],

    cost: ['roots', 5e7],
  },
  "RO\\41": {
    get description() { return `Incinerator's debuffs are weaker.` },
    branch: ["RO\\39"],

    cost: ['roots', 1e8],
  },
  "RO\\42": {
    get description() { return `Coal's Root effect is <b>twice</b> stronger.` },
    branch: ["RO\\35"],

    cost: ['roots', 1e9],
  },
  "RO\\43": {
    get description() { return `<b>${formatMult(2)}</b> to Leaves falling speed.` },
    branch: ["RO\\42"],

    cost: ['roots', 2e9],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'fallen-speed',
      calc: () => 2,
    }),
  },
  "RO\\44": {
    get description() { return `<b>${formatMult(2)}</b> to Leaves falling speed.` },
    branch: ["RO\\42"],

    cost: ['roots', 5e9],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'fallen-speed',
      calc: () => 2,
    }),
  },
  "RO\\45": {
    get description() { return `<b>${formatMult(2)}</b> to Basket cap.` },
    branch: ["RO\\44"],

    cost: ['roots', 8e9],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'fallen-basket',
      calc: () => 2,
    }),
  },
  "RO\\46": {
    get description() { return `<b>${formatMult(2)}</b> to Basket cap.` },
    branch: ["RO\\45"],

    cost: ['roots', 1.5e10],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'fallen-basket',
      calc: () => 2,
    }),
  },
  "RO\\47": {
    get description() { return `Leaves boost Leaves falling speed.` },
    branch: ["RO\\43"],

    cost: ['roots', 1.5e11],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'fallen-speed',
      calc: () => Decimal.add(player.leaves, 1).log10().div(2000).add(1),
    }),
  },
  "RO\\48": {
    get description() { return `<b>${formatMult(2)}</b> to Basket cap.` },
    branch: ["RO\\46"],

    cost: ['roots', 1e17],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'fallen-basket',
      calc: () => 2,
    }),
  },
  "RO\\49": {
    get description() { return `Fall challenge's best score boosts Fallen Leaves.` },
    branch: ["RO\\47"],

    cost: ['roots', 2e18],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'fallen-0',
      calc: () => Decimal.add(player.season.best[0][0], 1).log10().div(1e3).add(1),
    }),
  },
  "RO\\50": {
    get description() { return `Summer challenge's best score boosts Coal's 1st effect and Charcoal's effects.` },
    branch: ["RO\\49"],

    cost: ['roots', 5e19],

    effect: new Effect({
      type: EffectType.Exponent,
      static: false,
      calc: () => Decimal.add(player.season.best[1][0], 100).log(100).log(20).add(1),
    }),
  },
  "RO\\51": {
    get description() { return `<b>${formatMult(2)}</b> to Sacred Leaves.` },
    branch: ["RO\\50"],

    cost: ['roots', 1e21],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'sacred',
      calc: () => 2,
    }),
  },
  "RO\\52": {
    get description() { return `<b>RO50</b> affects <b>FA2</b>'s effect.` },
    branch: ["RO\\50"],

    cost: ['roots', 1e22],
  },
  "RO\\53": {
    permanent: true,
    get description() { return `Unlock a new repeatable Root upgrade permanently.` },
    branch: ["RO\\35"],

    cost: ['roots', 5e24],
  },
  "RO\\54": {
    get description() { return `Improve Sacred Leaves gain.` },
    branch: ["RO\\51"],

    cost: ['roots', 1e27],
  },
  "RO\\55": {
    get description() { return `<b>${formatMult(2)}</b> to Sacred Leaves and Roots, <b>${formatPow(2)}</b> to Virus.` },
    branch: ["RO\\54"],

    cost: ['roots', 1e33],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['roots','sacred'],
      calc: () => 2,
    }),
  },
  "RO\\56": {
    get description() { return `Roots boost Virus.` },
    branch: ["RO\\55"],

    cost: ['roots', 1e36],

    effect: new Effect({
      type: EffectType.Exponent,
      static: false,
      group: 'virus',
      calc: () => Decimal.div(player.root.amount, 1e33).add(1).log(1e3).add(1),
    }),
  },
  "RO\\57": {
    get description() { return `<b>${formatMult(3)}</b> to Fallen Leaves of all types.` },
    branch: ["RO\\54"],

    cost: ['roots', 2e37],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: ['fallen-0','fallen-1','fallen-2','fallen-3','fallen-4','fallen-5','fallen-6'],
      calc: () => 3,
    }),
  },
  "RO\\58": {
    get description() { return `The 1st Virus upgrade gain a bonus level per the 2nd and 3rd Virus upgrades.` },
    branch: ["RO\\56"],

    cost: ['roots', 4e38],

    effect: new Effect({
      type: EffectType.Addition,
      static: false,
      calc: () => softcap(Decimal.add(player.big_upgrades['virus\\2'],player.big_upgrades['virus\\3']), 100, 1/3, "L"),
    }),
  },
  //#endregion
  //#region Ash
  "A\\1": {
    get description() { return `<b>${formatMult(3)}</b> to Heat.` },
    branch: [],

    cost: ['ash', 1e12],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'heat',
      calc: () => 3,
    }),
  },
  "A\\2": {
    get description() { return `<b>${formatMult(10)}</b> to Ash.` },
    branch: ["A\\1"],

    cost: ['ash', 1e14],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'ash',
      calc: () => 10,
    }),
  },
  "A\\3": {
    get description() { return `<b>${formatMult(5)}</b> to Heat.` },
    branch: ["A\\2"],

    cost: ['ash', 1e18],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: 'heat',
      calc: () => 5,
    }),
  },
  "A\\4": {
    get description() { return `Ash boosts Heat.` },
    branch: ["A\\3"],

    cost: ['ash', 1e23],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: 'heat',
      calc: () => Decimal.add(player.furnace.ash, 10).log10().pow(2),
    }),
  },
  "A\\5": {
    get description() { return `<b>${formatMult(.1)}</b> to Charcoal requirement.` },
    branch: ["A\\4"],

    cost: ['ash', 1e27],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      calc: () => .1,
    }),
  },
  "A\\6": {
    get description() { return `Entropy divides Coal requirement.` },
    branch: ["A\\5"],

    cost: ['ash', 1e30],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.add(player.entropy, 10).log10().pow(-2),
    }),
  },
  "A\\7": {
    get description() { return `Ash divides Coal requirement.` },
    branch: ["A\\4"],

    cost: ['ash', 1e33],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      calc: () => Decimal.add(player.furnace.ash, 10).log10().pow(-2),
    }),
  },
  "A\\8": {
    get description() { return `<b>${formatMult(2)}</b> to Fallen Leaves.` },
    branch: ["A\\4"],

    cost: ['ash', 1e40],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fallen-0",
      calc: () => 2,
    }),
  },
  "A\\9": {
    get description() { return `<b>${formatMult(2)}</b> to Bronze Leaves.` },
    branch: ["A\\8"],

    cost: ['ash', 1e45],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fallen-1",
      calc: () => 2,
    }),
  },
  "A\\10": {
    get description() { return `<b>${formatMult(2)}</b> to Silver Leaves.` },
    branch: ["A\\9"],

    cost: ['ash', 1e47],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fallen-2",
      calc: () => 2,
    }),
  },
  "A\\11": {
    get description() { return `<b>${formatMult(2)}</b> to Golden Leaves.` },
    branch: ["A\\10"],

    cost: ['ash', 1e100],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fallen-3",
      calc: () => 2,
    }),
  },
  "A\\12": {
    get description() { return `<b>${formatMult(1.5)}</b> to Sacred Leaves.` },
    branch: ["A\\11"],

    cost: ['ash', 1e121],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "sacred",
      calc: () => 1.5,
    }),
  },
  "A\\13": {
    get description() { return `<b>${formatMult(2)}</b> to Platinum Leaves.` },
    branch: ["A\\12"],

    cost: ['ash', 1e243],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fallen-4",
      calc: () => 2,
    }),
  },
  "A\\14": {
    get description() { return `<b>${formatMult(6.66)}</b> to Sacred Leaves.` },
    branch: ["A\\13"],

    cost: ['ash', '6.666e666'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "sacred",
      calc: () => 6.66,
    }),
  },
  "A\\15": {
    get description() { return `<b>${formatMult(3)}</b> to True Autumn Leaves.` },
    branch: ["A\\14"],

    cost: ['ash', 'e800'],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fallen-6",
      calc: () => 3,
    }),
  },
  //#endregion
  //#region Fallen Leaves
  "FA\\1": {
    get description() { return `Tree age slowdown is <b>25%</b> weaker again.` },
    branch: [],

    cost: ['fallen-0', 1e24],
  },
  "FA\\2": {
    get description() { return `Fallen Leaves are increased by <b>10%</b> compounding per Charcoal.` },
    branch: ['FA\\1'],

    cost: ['fallen-0', 1e27],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: false,
      group: "fallen-0",
      calc: () => Decimal.pow(1.1, player.furnace.charcoal).pow(hasUpgrade("RO\\52") ? Effect.effect("upg-RO\\50") : 1),
    }),
  },
  "FA\\3": {
    permanent: true,
    get description() { return `Unlock <b>Auto-Fallen Leaf Upgrades</b> permanently.` },
    branch: ['FA\\1'],

    cost: ['fallen-0', 1e30],
  },
  "FA\\4": {
    permanent: true,
    get description() { return `Unlock <b>Auto-Brozen Leaf Upgrades</b> permanently.` },
    branch: ['FA\\3'],

    cost: ['fallen-0', 1e36],
  },
  "FA\\5": {
    permanent: true,
    get description() { return `Unlock <b>Auto-Silver Leaf Upgrades</b> permanently.` },
    branch: ['FA\\4'],

    cost: ['fallen-0', 1e50],
  },
  "FA\\6": {
    permanent: true,
    get description() { return `Unlock <b>Auto-Golden Leaf Upgrades</b> permanently.` },
    branch: ['FA\\5'],

    cost: ['fallen-0', 1e70],
  },
  "FA\\7": {
    permanent: true,
    get description() { return `Unlock <b>Auto-Platinum Leaf Upgrades</b> permanently.` },
    branch: ['FA\\6'],

    cost: ['fallen-0', 1e95],
  },
  "FA\\8": {
    permanent: true,
    get description() { return `Passively generate <b>1%</b> of your pending Roots permanently.` },
    branch: ['FA\\6'],

    cost: ['fallen-0', 1e100],
  },
  "FA\\9": {
    permanent: true,
    get description() { return `Sacred Leaf upgrades no longer take Sacred Leaves away permanently.` },
    branch: ['FA\\8'],

    cost: ['fallen-0', 1e105],
  },
  "FA\\10": {
    get description() { return `<b>${formatMult(5)}</b> to Leaves falling speed.` },
    branch: ['FA\\9'],

    cost: ['fallen-0', 1e110],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fallen-speed",
      calc: () => 5,
    }),
  },
  "FA\\11": {
    get description() { return `<b>${formatMult(5)}</b> to Leaves falling speed.` },
    branch: ['FA\\10'],

    cost: ['fallen-0', 1e130],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fallen-speed",
      calc: () => 5,
    }),
  },
  "FA\\12": {
    get description() { return `<b>${formatMult(5)}</b> to Leaves falling speed.` },
    branch: ['FA\\11'],

    cost: ['fallen-0', 1e170],

    effect: new Effect({
      type: EffectType.Multiplier,
      static: true,
      group: "fallen-speed",
      calc: () => 5,
    }),
  },
  //#endregion
};

export const UpgradeKeys = Object.keys(Upgrades)

export const UpgradeGroups: Record<string, string[]> = splitIntoGroups(UpgradeKeys)

{(()=>{
  UpgradeKeys.forEach(x => {
    Upgrades[x].condition ??= () => true;
    Upgrades[x].priority ??= 0;
  })
})()}

export const UpgradeKeysPriority = Object.keys(Upgrades).sort((x,y) => Upgrades[y].priority! - Upgrades[x].priority!)

export function hasUpgrade(id: string) : boolean { return player.upgrades[id] }
export function resetUpgradesByGroup(id: string, keep: string[] = []) { for (const i of UpgradeGroups[id]) if (!keep.includes(i) && !Upgrades[i].permanent) player.upgrades[i] = false; }

export function purchaseUpgrade(id: string, nospend = false) {
  const U = Upgrades[id], empty_branch = U.branch.length === 0

  if (
    player.upgrades[id]
    || !((player.discovered_upgrades[id]
    || U.condition!())
    && (empty_branch || (player.discovered_upgrades[id] ? U.branch.some(x => hasUpgrade(x)) : U.branch.every(x => player.discovered_upgrades[x]))))
  ) return;

  const cost = U.cost[1], C = Currencies[U.cost[0]]

  if (Decimal.lt(C.amount, cost)) return;

  player.upgrades[id] = true
  if (!nospend && !U.nospend) C.amount = Decimal.sub(C.amount, cost);
  player.discovered_upgrades[id] = true

  U.onbuy?.()
}
export function buyAllUpgrades(group: string, nospend = false, discovered = false) {
  for (const id of UpgradeGroups[group]) if (!discovered || player.discovered_upgrades[id]) purchaseUpgrade(id, nospend);
}

export function setupUpgrades() {
  for (const id of UpgradeKeysPriority) {
    const U = Upgrades[id], E = U.effect

    if (E) {
      E.changeID("upg-"+id)
      E.active = () => player.upgrades[id];
    }
  }

  new Effect({
    active: () => hasUpgrade("L\\22"),
    id: "upg-L\\22a",
    type: EffectType.Multiplier,
    static: true,
    group: 'leaves',
    calc: () => 3,
  })
  new Effect({
    active: () => hasUpgrade("L\\22"),
    id: "upg-L\\22b",
    type: EffectType.Multiplier,
    static: true,
    group: 'seeds',
    calc: () => 2,
  })
  new Effect({
    active: () => hasUpgrade("L\\22"),
    id: "upg-L\\22c",
    type: EffectType.Multiplier,
    static: true,
    group: 'fruits',
    calc: () => 1.5,
  })

  new Effect({
    active: () => hasUpgrade("L\\28"),
    id: "upg-L\\28a",
    type: EffectType.Multiplier,
    static: true,
    group: 'leaves',
    calc: () => 50,
  })
  new Effect({
    active: () => hasUpgrade("L\\28"),
    id: "upg-L\\28b",
    type: EffectType.Multiplier,
    static: true,
    group: 'seeds',
    calc: () => 15,
  })
  new Effect({
    active: () => hasUpgrade("L\\28"),
    id: "upg-L\\28c",
    type: EffectType.Multiplier,
    static: true,
    group: 'fruits',
    calc: () => 5,
  })

  new Effect({
    active: () => hasUpgrade("L\\34"),
    id: "upg-L\\34a",
    type: EffectType.Multiplier,
    static: true,
    group: 'age',
    calc: () => 5,
  })

  new Effect({
    active: () => hasUpgrade("L\\38"),
    id: "upg-L\\38a",
    type: EffectType.Multiplier,
    static: true,
    group: 'composting-speed',
    calc: () => 25,
  })
  new Effect({
    active: () => hasUpgrade("L\\38"),
    id: "upg-L\\38b",
    type: EffectType.Multiplier,
    static: true,
    group: 'entropy',
    calc: () => 1.2,
  })

  new Effect({
    active: () => hasUpgrade("L\\42"),
    id: "upg-L\\42a",
    type: EffectType.Multiplier,
    static: true,
    group: 'fruits',
    calc: () => 2,
  })

  new Effect({
    active: () => hasUpgrade("F\\23"),
    id: "upg-F\\23a",
    type: EffectType.Multiplier,
    static: true,
    group: 'age',
    calc: () => 5,
  })

  new Effect({
    active: () => hasUpgrade("F\\34"),
    id: "upg-F\\34a",
    type: EffectType.Multiplier,
    static: true,
    group: 'fruits',
    calc: () => 33,
  })
  new Effect({
    active: () => hasUpgrade("F\\34"),
    id: "upg-F\\34b",
    type: EffectType.Multiplier,
    static: true,
    group: 'seeds',
    calc: () => 333,
  })
  new Effect({
    active: () => hasUpgrade("F\\34"),
    id: "upg-F\\34c",
    type: EffectType.Multiplier,
    static: true,
    group: 'leaves',
    calc: () => 3333,
  })
  new Effect({
    active: () => hasUpgrade("F\\34"),
    id: "upg-F\\34d",
    type: EffectType.Multiplier,
    static: true,
    group: 'age',
    calc: () => 33333,
  })

  new Effect({
    active: () => hasUpgrade("S\\31"),
    id: "upg-S\\31a",
    type: EffectType.Multiplier,
    static: true,
    group: 'seeds',
    calc: () => 5,
  })

  new Effect({
    active: () => hasUpgrade("S\\33"),
    id: "upg-S\\33a",
    type: EffectType.Multiplier,
    static: true,
    group: 'seeds',
    calc: () => 5,
  })
  new Effect({
    active: () => hasUpgrade("S\\33"),
    id: "upg-S\\33b",
    type: EffectType.Multiplier,
    static: true,
    group: 'fruits',
    calc: () => 2,
  })

  new Effect({
    active: () => hasUpgrade("S\\34"),
    id: "upg-S\\34a",
    type: EffectType.Multiplier,
    static: true,
    group: 'ages',
    calc: () => 5,
  })

  new Effect({
    active: () => hasUpgrade("S\\35"),
    id: "upg-S\\35a",
    type: EffectType.Multiplier,
    static: true,
    group: 'entropy',
    calc: () => 1.2,
  })

  new Effect({
    active: () => hasUpgrade("S\\39"),
    id: "upg-S\\39a",
    type: EffectType.Multiplier,
    static: true,
    group: 'entropy',
    calc: () => 2,
  })

  new Effect({
    active: () => hasUpgrade("S\\43"),
    id: "upg-S\\43a",
    type: EffectType.Multiplier,
    static: true,
    group: 'entropy',
    calc: () => 2,
  })

  new Effect({
    active: () => hasUpgrade("F\\26"),
    id: "upg-F\\26a",
    type: EffectType.Multiplier,
    static: true,
    group: 'composting-speed',
    calc: () => 100,
  })

  new Effect({
    active: () => hasUpgrade("F\\28"),
    id: "upg-F\\28a",
    type: EffectType.Multiplier,
    static: true,
    group: 'seeds',
    calc: () => 5,
  })
  new Effect({
    active: () => hasUpgrade("F\\28"),
    id: "upg-F\\28a",
    type: EffectType.Multiplier,
    static: true,
    group: ['fruits','age'],
    calc: () => 2,
  })

  new Effect({
    active: () => hasUpgrade("F\\31"),
    id: "upg-F\\31a",
    type: EffectType.Multiplier,
    static: true,
    group: 'entropy',
    calc: () => 2,
  })

  new Effect({
    active: () => hasUpgrade("F\\37"),
    id: "upg-F\\37a",
    type: EffectType.Multiplier,
    static: true,
    group: 'entropy',
    calc: () => 2,
  })

  new Effect({
    active: () => hasUpgrade("RO\\55"),
    id: "upg-F\\55a",
    type: EffectType.Exponent,
    static: true,
    group: 'virus',
    calc: () => 2,
  })
}
