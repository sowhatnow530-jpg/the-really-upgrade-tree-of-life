import { player, temp } from "@/main"
import Decimal from "break_eternity.js"
import { hasUpgrade, resetUpgradesByGroup, UpgradeGroups, Upgrades } from "./upgrades"
import { resetTemp } from "@/update"
import { format } from "@/utils/formats"
import { resetRepeatableUpgradesByGroup } from "./repeatable_upgrades"
import { resetBigUpgradesByGroup } from "./big_upgrades"
import { D, DC } from "@/utils/decimal"
import { FallenLeaves } from "./fallen"

export const Resets: Record<string, {
  reached: boolean
  description: string
  perform(): void
  reset(): void
}> = {
  seeds: {
    get reached() { return player.discovered_upgrades['L\\6'] && Decimal.gte(player.leaves, 5e6) },
    
    get description() {
      return this.reached ? `Decompolize your tree for <b>${format(temp.currencies.seeds, 0)}</b> Seeds` : `Reach <b>${format(1e7)}</b> Leaves`
    },

    perform() {
      if (!this.reached) return;

      player.seeds = Decimal.add(player.seeds, temp.currencies.seeds)
      player.first.seed = true

      this.reset();
    },

    reset() {
      player.leaves = 0
      player.age = 0
      resetUpgradesByGroup("L")
      resetRepeatableUpgradesByGroup("LR")

      resetTemp()
    },
  },
  fruits: {
    get reached() { return player.discovered_upgrades['L\\16'] && Decimal.gte(player.seeds, 2.5e7) },

    get description() {
      return this.reached ? `Harvest your tree for <b>${format(temp.currencies.fruits, 0)}</b> Fruits` : `Reach <b>${format(2.5e7)}</b> Seeds`
    },

    perform() {
      if (!this.reached) return;

      player.fruits = Decimal.add(player.fruits, temp.currencies.fruits)
      player.first.fruit = true

      this.reset();
    },

    reset() {
      player.seeds = 0
      resetUpgradesByGroup("S")
      resetRepeatableUpgradesByGroup("SR")
      if (hasUpgrade("E\\3") && player.discovered_upgrades["S\\20"]) player.upgrades["S\\20"] = true;

      if (!hasUpgrade("E\\8")) for (let i = 0; i < 2; i++) {
        player.composter[i].active = false;
        player.composter[i].time = 0;
        player.composter[i].fertilizers = 0;
      }

      Resets.seeds.reset()
    },
  },
  entropy: {
    get reached() { return player.discovered_upgrades['L\\28'] && Decimal.gte(player.PE, 2e22) },

    get description() {
      return this.reached ? `Transform your tree into some powerful energy for <b>${format(temp.currencies.entropy, 0)}</b> Entropy` : `Reach <b>${format(2e22)}</b> Potential Energy`
    },

    perform() {
      if (!this.reached) return;

      player.entropy = Decimal.add(player.entropy, temp.currencies.entropy)
      player.first.entropy = true

      this.reset();
    },

    reset() {
      player.fruits = 0
      const k = []
      if (hasUpgrade("E\\5")) k.push("F\\1","F\\2","F\\6");
      resetUpgradesByGroup("F",k)
      resetRepeatableUpgradesByGroup("FR")

      for (let i = 0; i < 3; i++) {
        player.composter[i].active = false;
        player.composter[i].time = 0;
        player.composter[i].fertilizers = 0;
      }

      player.virus = 1

      if (!hasUpgrade("E\\12")) player.cell.amount = hasUpgrade("RO\\M4") ? DC.DE308 : 1;

      Resets.fruits.reset()
    },
  },
  bacteria: {
    get reached() { return Decimal.gte(player.entropy, 3e4) && Decimal.gte(player.cell.amount, 'e350') },

    get description() {
      return this.reached ? `Convert all your Cells and Entropy for <b>${format(temp.currencies.bacteria, 0)}</b> Bacteria` : `Reach <b>${format(3e4)}</b> Entropy and <b>${format('e350')}</b> Cells`
    },

    perform() {
      if (!this.reached) return;

      player.bacteria.amount = Decimal.add(player.bacteria.amount, temp.currencies.bacteria)

      this.reset();
    },

    reset() {
      player.entropy = hasUpgrade("E\\27") ? Decimal.div(player.entropy, 100).round() : 0
      player.cell.amount = 1
    },
  },
  root: {
    get reached() { return Decimal.gte(player.leaves, 'e1500') },

    get description() {
      return this.reached ? `Reinforce your tree and go underground for <b>${format(temp.currencies.roots, 0)}</b> Roots` : `Reach <b>${format('e1500')}</b> Leaves`
    },

    perform() {
      if (!this.reached) return;

      player.root.amount = Decimal.add(player.root.amount, temp.currencies.roots)
      player.root.total = Decimal.add(player.root.total, temp.currencies.roots)
      player.first.root = true

      this.reset();
    },

    reset() {
      player.entropy = 0
      player.cell.amount = 1
      player.bacteria.types = hasUpgrade("RO\\M4") ? 1 : 0
      player.bacteria.amount = 0
      resetUpgradesByGroup("E",["E\\5","E\\8"])
      resetBigUpgradesByGroup("cell")
      resetBigUpgradesByGroup("bacteria",["bacteria\\3"])

      player.weather.active = -1
      if (!hasUpgrade("RO\\M5")) for (let i = 0; i < 4; i++) player.weather.best[i][0] = 0;

      for (let i = 0; i < 4; i++) {
        player.composter[i].active = false;
        player.composter[i].time = 0;
        player.composter[i].fertilizers = 0;
      }

      for (let i = 0; i < 3; i++) player.incinerator[i][1] = D(player.incinerator[i][0]);

      player.furnace.heat = 0
      player.furnace.ash = 0
      if (!hasUpgrade("RO\\M9")) player.furnace.coal = 0;

      Resets.entropy.reset()
    },
  },
  sacred: {
    get reached() { return Decimal.gte(player.fallen[0], 1e25) },

    get description() {
      return this.reached ? `Sacrifice your Fallen Leaves for <b>${format(temp.currencies.sacred, 0)}</b> Sacred Leaves` : `Reach <b>${format(1e25)}</b> Fallen Leaves`
    },

    perform() {
      if (!this.reached) return;

      player.sacred = Decimal.add(player.sacred, temp.currencies.sacred)

      this.reset();
    },

    reset() {
      for (let i = 0; i < FallenLeaves.resources.length; i++) {
        player.fallen[i] = 0
        resetBigUpgradesByGroup("fallen-"+i,['fallen-'+i+'\\2'])
      }

      temp.fallen_speed = 2;
      temp.basket_cap = 25;
    },
  },
}

export function respecRootUpgrades() {
  if (confirm("Are you sure you want to respec Root Upgrades? It forces a Reinforcement and gives you all Roots back.")) {
    Resets.root.reset()

    for (const id of UpgradeGroups['RO']) {
      const U = Upgrades[id]

      if (U.permanent || U.cost[0] === 'total-roots' || !player.upgrades[id]) continue;

      player.upgrades[id] = false;

      player.root.amount = Decimal.add(player.root.amount, U.cost[1])
    }
  }
}
