  # joylink
  A virtual smartphone controller for the PC with preset layouts that maps controller inputs to keyboard and mouse inputs

  There are 2 main apps: desktop-app and controller-app
  The desktop-app is where most of our code lies and where most commands will be ran. 

  # Usage Instructions
  ## Step 1 - Controller App
  - cd into `controller-app` and run `npm install` followed by `npm update`
  - run `npm run build`

  ## Step 2 - Desktop App
  - cd into `desktop-app` and run `npm install` followed by `npm update`
  - create a directory `certs` and cd into it
  - create a local ssl certificate (this is required to create a secure https connection between the controller and your desktop. Without it, you cannot access the motion-sensor APIs or the microphone from the browser).
  -- run the command `mkcert -key-file key.pem -cert-file cert.pem <Private_IP_Address>`
  -- Note: Windows users may have to install `choco` to install mkcert and run this command or directly install the mkcert package from their website and add it to your path. (Please see the relevant documentation)



  To run singular typescript nodes (i.e. execute typescript files like how you would run python files) directly from command line, run the following command `npx ts-node path_to_ts_file`
  Note that you must first ensure that in your package.json, you temporarily comment out `type: "module"`


