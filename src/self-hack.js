/** @param {NS} ns **/
export async function main(ns) {
	var data = ns.flags([
		['threads', 4],
		['moneyBearer', 8000000],
		['moneyTreshold', 0.5],
		['securityTreshold', 0.75]
	]);
	var i = 0;
	var hostinfo = JSON.parse(ns.read('host.txt'));
	var hostname = hostinfo.hostname;
	ns.print("hack: running script on " + hostname);

	while (true) {
		i++;
		var srvMaxMoney = hostinfo.moneyMax;
		var srvAvMoney = ns.getServerMoneyAvailable(hostname);
		var srvMinSec = hostinfo.minDifficulty;
		var srvCurSec = ns.getServerSecurityLevel(hostname);

		if (srvMaxMoney >= data.moneyBearer) {
			ns.print("hack: iteration " + i + " on server " + hostname);
			if (srvAvMoney >= (srvMaxMoney * data.moneyTreshold)) {
				ns.print("hack: collect money: " + srvAvMoney + "/" + srvMaxMoney);
				await ns.hack(hostname, { threads: data.threads });
			} else {
				ns.print("hack: grow money: " + srvAvMoney + "/" + srvMaxMoney);
				await ns.grow(hostname, { threads: data.threads });
			}
			if (srvCurSec >= (srvMinSec + (srvMinSec * data.securityTreshold))) {
				ns.print("hack: difficulty: " + srvCurSec + "/" + srvMinSec);
				await ns.weaken(hostname, { threads: data.threads });
			}
		}
		
		await ns.sleep(2000);
	}
}