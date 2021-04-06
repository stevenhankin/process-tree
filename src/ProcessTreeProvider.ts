import * as vscode from "vscode";
import * as path from "path";
import * as si from "systeminformation";

export class ProcessTreeProvider implements vscode.TreeDataProvider<Process> {
  constructor(private processes: si.Systeminformation.ProcessesProcessData[]) {}

  getTreeItem(element: Process): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Process): Thenable<Process[]> {
    if (element === undefined) {
      const rootProcess = this.processes.find((p) => p.parentPid === 0);
      if (rootProcess) {
        const x = new Process(
          rootProcess.name,
          rootProcess,
          vscode.TreeItemCollapsibleState.Expanded
        );
        return Promise.resolve([x]);
      }
    } else {
      console.log();
      const children = this.processes
        .filter((p) => p.parentPid === element.process.pid)
        .map(
          (p) =>
            new Process(p.name, p, vscode.TreeItemCollapsibleState.Expanded)
        );
      return Promise.resolve(children);
    }

    return Promise.resolve([]);
  }
}

class Process extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public process: si.Systeminformation.ProcessesProcessData,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    // this.tooltip = `${this.label}-${this.version}`;
    this.description = `${process.name}: ${process.memVsz}`;
  }

  iconPath = {
    light: path.join(
      __filename,
      "..",
      "..",
      "resources",
      "light",
      "dependency.svg"
    ),
    dark: path.join(
      __filename,
      "..",
      "..",
      "resources",
      "dark",
      "dependency.svg"
    ),
  };
}
