import Cocoa

@main
final class AppDelegate: NSObject, NSApplicationDelegate {
    private let storedRootKey = "ecen224.courseRoot"
    private var server: Process?
    private var statusItem: NSStatusItem!

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory)
        makeMenu()
        startAndOpen()
    }

    func application(_ application: NSApplication, open urls: [URL]) {
        if urls.contains(where: { $0.scheme == "ecen224-terminal" }) { startAndOpen() }
    }

    func applicationWillTerminate(_ notification: Notification) {
        if server?.isRunning == true { server?.terminate() }
    }

    private func makeMenu() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        statusItem.button?.title = "ECEn 224"
        let menu = NSMenu()
        menu.addItem(withTitle: "Open Game 1 Practice", action: #selector(startFromMenu), keyEquivalent: "o")
        menu.addItem(withTitle: "Choose Course Folder…", action: #selector(chooseRoot), keyEquivalent: "")
        menu.addItem(.separator())
        menu.addItem(withTitle: "Quit", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        statusItem.menu = menu
    }

    @objc private func startFromMenu() { startAndOpen() }

    @objc private func chooseRoot() {
        let panel = NSOpenPanel()
        panel.canChooseFiles = false
        panel.canChooseDirectories = true
        panel.allowsMultipleSelection = false
        panel.message = "Select your ecen224-course checkout"
        panel.prompt = "Use this folder"
        guard panel.runModal() == .OK, let root = panel.url else { return }
        guard isCourseRoot(root) else {
            alert("That folder does not contain tools/dev-server.py. Select the ecen224-course checkout.")
            return
        }
        UserDefaults.standard.set(root.path, forKey: storedRootKey)
        startAndOpen()
    }

    private func startAndOpen() {
        guard let root = courseRoot() else { return }
        if server?.isRunning != true {
            let process = Process()
            process.executableURL = URL(fileURLWithPath: "/usr/bin/env")
            process.arguments = ["python3", "tools/dev-server.py"]
            process.currentDirectoryURL = root
            process.standardOutput = Pipe()
            process.standardError = Pipe()
            do {
                try process.run()
                server = process
            } catch {
                alert("Could not start the local study server: \(error.localizedDescription)")
                return
            }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.45) {
            NSWorkspace.shared.open(URL(string: "http://127.0.0.1:8018/game1-practice.html")!)
        }
    }

    private func courseRoot() -> URL? {
        if let saved = UserDefaults.standard.string(forKey: storedRootKey) {
            let url = URL(fileURLWithPath: saved)
            if isCourseRoot(url) { return url }
        }
        var bundledRoot = Bundle.main.bundleURL
        for _ in 0..<4 { bundledRoot.deleteLastPathComponent() }
        if isCourseRoot(bundledRoot) {
            UserDefaults.standard.set(bundledRoot.path, forKey: storedRootKey)
            return bundledRoot
        }
        chooseRoot()
        return nil
    }

    private func isCourseRoot(_ root: URL) -> Bool {
        FileManager.default.fileExists(atPath: root.appendingPathComponent("tools/dev-server.py").path)
    }

    private func alert(_ message: String) {
        let notice = NSAlert()
        notice.messageText = "ECEn 224 Terminal"
        notice.informativeText = message
        notice.runModal()
    }
}
