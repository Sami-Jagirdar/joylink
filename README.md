  # joylink
  Turn your smartphone into a virtual Gamepad, presentation remote, presenter remote, media controller and beyond.
  A virtual smartphone controller for the PC with preset layouts that maps controller inputs to keyboard and mouse inputs

  There are 2 main apps: desktop-app and controller-app
  The desktop-app is where most of our code lies and where most commands will be ran. 

  # Usage Instructions
  ## Preface
  This application was rigorously tested on a Windows desktop with an Android phone accessing a Chrome browser.
  While it has also been tested with other platforms like MacOS and iOS devices, we can guarantee all features to work only on a Windows desktop with Android phones.

  - Clone this repository `git clone https://github.com/Sami-Jagirdar/joylink.git`

  ## Step 1 - Controller App
  - cd into `controller-app` and run `npm install` followed by `npm update`
  - run `npm run build`

  ## Step 2 - Desktop App
  - cd into `desktop-app` and run `npm install` followed by `npm update`

    ### SSL Certificate
  - create a directory `certs` (`mkdir certs`) and cd into it
  - create a local ssl certificate (this is required to create a secure https connection between the controller and your desktop. Without it, you cannot access the motion-sensor APIs or the microphone from the browser).
  -  -- run the command `mkcert -key-file key.pem -cert-file cert.pem <Private_IP_Address>`
  -  -- Note: Windows users may have to install `choco` to install mkcert and run this command or directly install the mkcert package from their website and add it to your path. (Please see the relevant documentation)

  ### PicoVoice (Voice Recognition) Setup
  - Create a free picovoice account and train the Rhino Model. (This is required, because the free version only limits its usage to one user, so we developers can't share our key or model to the public).
  (https://www.youtube.com/watch?v=IPC_pCT9r1o&t=1s&ab_channel=Picovoice)
  - Choose the following intent and slots (don't modify) -->
  - - Intent Name: controllerCommand
    - Intent: Joy Link $command:commandString
    - Slot Name: $command
    - Slots:
      - stop
      - move
      - block
      - kick
      - jump
      - punch
      - crouch
      - shoot
  - Choose the model option for desktop (Windows, MacOS, or Linux depending on your OS) 
  - You should now have your own access key and a zip folder with a `.rhn` file. This is your contexts file for PicoVoice to recognize.
  - cd back into the `desktop-app`
  - create a `contexts` directory (`mkdir contexts`)
  - copy and paste your contexts file into this directory (Has the extension `.rhn` provided you trained for Windows)
  - in your `desktop-app` directory, create a `.env` file and add the following:
  ``` 
  LOCAL_PORT=7777
  PICOVOICE_KEY=<Your_Access_Key>
  CONTEXT_FILE_PATH=contexts/<Your_context_filename>
  ```

  You are now ready to use JoyLink!

  - Run `npm run dev` in the `desktop-app` directory.
  - Note: It may take some time to load initially, but subsequent runs will be much faster


  # User Guide
  ## 1. Start Page
  - Once the app Launches, you will be greated to the Start Page. Simply click on Start to continue
  
  ## 2. Choose Layout Page
  - The next page will prompt you to choose between 2 layouts.
  - Layout one only has buttons that are large
  - Layout two has the same buttons but smaller and adds two analog sticks at the bottom
  - You can choose to enable or disable Voice Commands and/or motion controls. These settings will apply to either of the chosen layout. 
  - Click on the Customize button to move forward

  ## 3. Customize Page
  - The customize page allows you to customize the mappings of the layout you chose previously.
  - There are 4 types of inputs
    - Button: Click on customize to bind it to upto 3 keys OR a mouse click
    - Analog: Click on customize to bind it to upto 3 keys for each direction of the analog (left, right, up, down) OR directly map the analog x-y position to mouse motion. You can choose to set the sensitivity of the mouse motion (1-100)
    - Voice commands: Same customize options as Button
    - Motion controls: Same customize options as analog, but here you are mapping the x-y acceleration of your phone with respect to the ground using accelerometer readings from your device.
  - Note: If you choose to map a single input to multiple simultaneous keys (up to 3), two of the chosen keys must be modifier keys (CTRL, SHIFT, ALT) because the library used to automate key presses cannot press two regular keys (like Key.A + Key.W) simultaneously, it must press one before the other. This limitation doesn't apply to modifier keys.
  - After you have customized your inputs, you can shoose to save the mappings as a default layout by clicking on the Save Layout button. If you close and rerun your application, the loaded mappings for the chosen layout will be the one that was saved last.
  - Click on the Play button to continue


  ## 4. Connections Page
  - Scan the QR code with your phone or enter the displayed URL in a browser to access the controller interface
  - Note, on your first visit, you may have to continue past the warning that the website is not secure. This warning comes because the SSL certificate was self generated. 
  - You will now be able to press buttons, move the analog stick, tilt your phone (if motion controls enabled), speak voice commands (if voice commands enabled) to execute the corresponding keyboard / mouse actions!
  - Note: For voice commands: You will need to preface each command with the hotword - 'JoyLink'. For example, if the command is 'punch', you will need to say 'Joylink punch' for the command to be recognized. 
  - No other device will be able to connect while one device is already connected
  - The connected device can be disconnected by simply closing the browser tab or clicking the Disconnect button on the connections page
  - Enjoy!






