const chalk = require('chalk');

module.exports = (data, option) => {
	switch (option) {
		case "warn":
			console.log(chalk.bold.hex("#00EE00")('[ ❕ ] → ') + data);
			break;
		case "error":
			console.log(chalk.bold.hex("#FF00FF")('[ Lỗi rồi ] → ') + data);
			break;
		default:
			console.log(chalk.bold.hex("#FF6600")(`${option} → `) + data);
			break;
	}
}

module.exports.loader = (data, option) => {
	switch (option) {
		case "warn":
			console.log(chalk.bold.hex("#00CC33")('[ Gkhanh ] ') + data);
			break;
		case "error":
			console.log(chalk.bold.hex("#00CCFF")('[ Gkhanh ] ') + data);
			break;
		default:
			console.log(chalk.bold.hex("#FF6633")('[ Gkhanh ] ') + data);
			break;
	}
}
