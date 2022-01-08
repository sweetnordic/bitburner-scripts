/** @param {NS} ns **/
export async function main(ns) {
	var amount = 0;
	var ram = 1024;
	var name = "psrv";
	var maxServerCount = ns.getPurchasedServerLimit();
	var maxServerRam = ns.getPurchasedServerMaxRam();
	var servers = ns.getPurchasedServers();
	var serverCount = servers.length;
	var money = ns.getServerMoneyAvailable("home");

	ns.disableLog("getServerMoneyAvailable");

	if (ns.args.length >= 1) {
		amount = ns.args[0];
		if (ns.args.length >= 2) {
			ram = ns.args[1];
			if (ns.args.length >= 3) {
				name = ns.args[2];
			}
		}
	} else {
		ns.tprint(`usage: run ${ns.getScriptName()} <amount:0> [<ram:1024>] [<name:psrv>]`);
        ns.tprint("example:");
        ns.tprint(` 25x16GB > run ${ns.getScriptName()} 25 16384`);
		ns.tprint(` 25x16TB > run ${ns.getScriptName()} 25 16777216`);
		ns.tprint(` 25x1024TB > run ${ns.getScriptName()} 25 1073741824`);
		return;
	}

	if ((amount + serverCount) > maxServerCount) {
		amount = maxServerCount - serverCount;
	}
	ns.print("amount: " + amount);

	if (ram > maxServerRam) {
		ram = maxServerRam;
	}
	ns.print("ram: " + ram);
	ns.tprint("buy " + amount + " server with " + (ram / 1024) + " gb of ram.");

	var singleServerCosts = ns.getPurchasedServerCost(ram);
	var allServerCosts = singleServerCosts * amount;
	ns.print("all server costs: " + allServerCosts);
	ns.print("single server costs: " + singleServerCosts);
	if (money < allServerCosts) {
		ns.tprint("not enough money for all server");
		ns.print("not enough money for all server");
	} else {
		ns.print("enough money for every server");
	}

	for (var i = 0; i < amount; ++i) {
		if (ns.getServerMoneyAvailable("home") > singleServerCosts) {
			ns.tprint(ns.purchaseServer(name, ram));
		}
	}

}
