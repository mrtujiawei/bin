import {
  isDirectory,
  isFileExist,
  mkdir,
  exec,
  readFile,
} from '@mrtujiawei/node-utils';
import path from 'path';

const CLASSPATH_DIR = '.vim';
const CLASSPATH_FILE = `${CLASSPATH_DIR}/classpath`;
const MAVEN_TARGET_DIR = 'target/classes';
// const MAVEN_TARGET_TEST_DIR = 'target/test-classes';

const read_classpath = async () => {
  const classpath = await readFile(CLASSPATH_FILE);
  return classpath.trimEnd();
};

const determine_target_dir = (_filename: string) => {
  // if filename.startswith("src/test"):
  //     return MAVEN_TARGET_TEST_DIR
  // else:
  return MAVEN_TARGET_DIR;
};

const compileJavaFile = async (filename: string, classpath: string) => {
  const target = determine_target_dir(filename);
  const cmd = `javac -d ${target} -cp ${classpath} ${filename}`;
  // console.log(cmd);
  // const res =
    await exec(cmd);
  // console.log(res);
};

const runJavaClass = async (classname: string, classpath: string) => {
  // joined_compiler_params = " ".join(compiler_params)
  // joined_app_params = " ".join(app_params)
  const cmd = `java -cp ${classpath} ${classname}`;
  // console.log(cmd);
  const res = await exec(cmd);
  console.log(res);
};

const generateClasspath = async () => {
  console.log('Generating classpath...');
  try {
    await isDirectory(CLASSPATH_DIR);
  } catch (e) {
    await mkdir(CLASSPATH_DIR);
  }

  const cmd = `mvn -q org.codehaus.mojo:exec-maven-plugin:exec -Dexec.executable="echo" -Dexec.args="%classpath" > ${CLASSPATH_FILE}`;
  // console.log(cmd);
  // const res =
    await exec(cmd);
  // console.log(res);
};

const determine_packagename = async (filename: string) => {
  const content = await readFile(filename);
  for (const line of content.split('\n')) {
    if (line.startsWith('package')) {
      return line.match(/^package ([0-9A-Za-z_.]*);?$/)![1];
    }
  }
};

const determineClassname = async (filename: string) => {
  const packagename = await determine_packagename(filename);
  const basename = path.basename(filename);
  const { name } = path.parse(basename);
  // if ext == '.scala':
  //     return f"{packagename}.{name}$delayedInit$body"
  // elif ext == '.kt':
  //     return f"{packagename}.{name}Kt"
  // else:
  return `${packagename}.${name}`;
};

const runProgram = async (filename: string) => {
  const exists = await isFileExist(CLASSPATH_FILE);
  if (!exists) {
    await generateClasspath();
  }

  const classpath = await read_classpath();

  await compileJavaFile(filename, classpath);

  const classname = await determineClassname(filename);
  runJavaClass(classname, classpath);
  // jvm_params, app_params = split_params(params)
  //
  // name, ext = os.path.splitext(filename)
  // if ext == '.java' and is_stale(filename, determine_classfile(filename, classname)):
  //     compile_java_file(filename, classpath)
  // if name.endswith("Test"):
  //     runner_params = determine_junit_runner_params(classpath, classname)
  //     run_java_class(runner_params[0], jvm_params, runner_params[1:] + app_params, classpath)
  // else:
  // run_java_class(classname, jvm_params, app_params, classpath)
};

const runJava = (filename: string) => {
  if (!path.isAbsolute(filename)) {
    filename = path.resolve(process.cwd(), filename);
  }
  runProgram(filename);
};

export default runJava;

// def main():
//     argc = len(sys.argv)
//     if argc == 1:
//         print_help()
//     elif sys.argv[1] == "-cp":
//         generate_classpath()
//     elif sys.argv[1] == "-c":
//         compile_files(sys.argv[2:])
//     else:
//         print_help()
//
//
// def print_help():
//     print("Usage:")
//     print("")
//     print("*  runjava.py -r <filename> [<jvm-parameters> --] [<cmd-line parameters>]")
//     print("")
//     print("   Compiles the given filename if necessary, then runs it as a")
//     print("   Java program against the generated classpath,")
//     print("   with the given JVM parameters and command-line parameters,")
//     print("   if present. Note that the JVM parameters must be followed by")
//     print("   two dashes (--), even if no command-line parameters follow.")
//     print("")
//     print("")
//     print("*  runjava.py -c <filename> [<filename>]...")
//     print("")
//     print("   Compiles the given files if necessary.")
//     print("")
//     print("")
//     print("*  runjava.py -cp")
//     print("")
//     print("   Refreshes the generated classpath file.")
//     print("")
//
//
//
// def compile_files(filenames):
//     if not os.path.exists(CLASSPATH_FILE):
//         generate_classpath()
//     classpath = read_classpath()
//     for filename in filenames:
//         _, ext = os.path.splitext(filename)
//         classname = determine_classname(filename)
//         if ext == '.java' and is_stale(filename, determine_classfile(filename, classname)):
//             compile_java_file(filename, classpath)
//
//
// def determine_classfile(filename, classname):
//     target = determine_target_dir(filename)
//     replaced = classname.replace(".", "/")
//     return f"{target}/{replaced}.class"
//
//
// def determine_junit_runner_params(classpath, classname):
//     if "scalatest" in classpath:
//         return ["org.scalatest.tools.Runner", "-oW", "-s", classname]
//     elif "junit-platform-console" in classpath:
//         return ["org.junit.platform.console.ConsoleLauncher", "--disable-ansi-colors", "--select-class", classname]
//     elif "junit-jupiter-engine" in classpath:
//         raise "When using JUnit 5, add junit-platform-console to your dependencies!"
//     elif "junit/4." in classpath:
//         return ["org.junit.runner.JUnitCore", classname]
//     elif "junit/3." in classpath:
//         return ["junit.textui.TestRunner", classname]
//     else:
//         raise "Can't figure out which unit test runner to use"
//
//
//
// def split_params(params):
//     jvm_params = []
//     app_params = []
//     for p in params:
//         if p == "--":
//             jvm_params = app_params
//             app_params = []
//         else:
//             app_params.append(p)
//     return (jvm_params, app_params)
//
//
// def is_stale(first, second):
//     try:
//         first_time = os.path.getmtime(first)
//         second_time = os.path.getmtime(second)
//         return first_time > second_time
//     except FileNotFoundError:
//         return True
//
//
// def execute(cmd):
//     os.system(cmd)
//
//
// if __name__ == "__main__":
//     main()
