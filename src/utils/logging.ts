import chalk from "chalk";

export async function LogError(message: any) {
  console.log(chalk.red(`[ERROR] ${message}`));
}

export async function Log(message: any) {
  console.log(chalk.blue(`[LOG] ${message}`));
}

export async function LogDebug(message: any) {
  console.log(chalk.green(`[DEBUG] ${message}`));
}
