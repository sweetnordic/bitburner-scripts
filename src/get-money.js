/** @param {NS} ns **/
export async function main(ns) {
	ns.tprint("usage: run " + ns.getScriptName() + " --hostname zer0 --threads 8 -t 8");
	var data = ns.flags([
		['hostname', 'zer0'],
		['threads', 4]
	]);
	var i = 0;
	while (true) {
		i++;
		ns.print(data.hostname + " " + i);
		await ns.hack(data.hostname, { threads: data.threads });
	}
}