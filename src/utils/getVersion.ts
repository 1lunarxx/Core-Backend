interface Version {
  cl: number;
  build: number;
}

export async function getVersion(c: any): Promise<Version> {
  const header = c.req.header("user-agent") || "";
  const splitter = header.match(/Release-(\d+)\.\d+-CL-(\d+)/);

  const build = parseInt(splitter[1]);
  const cl = parseInt(splitter[2]);

  return { cl, build };
}
