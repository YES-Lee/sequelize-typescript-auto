@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe" "%~dp0\sequelize-typescript-auto" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node "%~dp0\sequelize-typescript-auto" %*
)
