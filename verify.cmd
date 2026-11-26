@echo off
node check.mjs || exit /b 1
node lint.mjs || exit /b 1
node eval.mjs || exit /b 1
node unit.mjs || exit /b 1
node bundle.mjs || exit /b 1
node e2e.mjs || exit /b 1
