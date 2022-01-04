/** @param {NS} ns **/
export async function main(ns) {
	var amount = 1;
	var ram = 64;
	var name = "psrv";

	if (ns.args.length >= 1) {
		amount = ns.args[0];
		if (ns.args.length >= 2) {
			ram = ns.args[1];
			if (ns.args.length >= 3) {
				name = ns.args[2];
			}
		}
	}

	for (var i = 0; i < amount; ++i) {
		ns.tprint(ns.purchaseServer(name, ram));
	}

}
