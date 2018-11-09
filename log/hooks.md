test
i1
R_CHECK_IF_MODULE_TASK_EXISTANT 1
R_CHECK_IF_MODULE_TASK_EXISTANT 1
pre-commit

> yagpt@0.0.35 test /home/mod/me-code/public/yagpt
> npm run test:src


> yagpt@0.0.35 test:src /home/mod/me-code/public/yagpt
> nyc mocha --opts mocha.src.opts

------------------------------|----------|----------|----------|----------|-------------------|
File                          |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
------------------------------|----------|----------|----------|----------|-------------------|
All files                     |    28.11 |     3.45 |       25 |       27 |                   |
 src                          |        0 |        0 |      100 |        0 |                   |
  cli.ts                      |        0 |        0 |      100 |        0 |               4,5 |
 src/utils/nodejs/array       |        0 |        0 |        0 |        0 |                   |
  index.ts                    |        0 |        0 |        0 |        0 |                   |
 src/utils/nodejs/environment |    83.33 |      100 |       50 |       80 |                   |
  index.ts                    |    83.33 |      100 |       50 |       80 |                 8 |
 src/utils/nodejs/json        |    78.95 |       50 |      100 |    77.78 |                   |
  index.ts                    |    78.95 |       50 |      100 |    77.78 |       25,26,33,42 |
 src/utils/nodejs/path        |    19.18 |        0 |    14.29 |    18.06 |                   |
  index.ts                    |    19.18 |        0 |    14.29 |    18.06 |... 15,220,223,229 |
 src/utils/nodejs/program     |        0 |      100 |        0 |        0 |                   |
  index.ts                    |        0 |      100 |        0 |        0 |             32,33 |
 src/utils/nodejs/prompt      |        0 |        0 |        0 |        0 |                   |
  index.ts                    |        0 |        0 |        0 |        0 |                   |
 src/utils/yagpt/module       |        0 |      100 |      100 |        0 |                   |
  index.ts                    |        0 |      100 |      100 |        0 |                14 |
 src/utils/yagpt/package      |    15.48 |        0 |     12.5 |    15.19 |                   |
  index.ts                    |    15.48 |        0 |     12.5 |    15.19 |... 48,361,362,370 |
 src/utils/yagpt/test         |     37.1 |        0 |       25 |    36.21 |                   |
  index.ts                    |     37.1 |        0 |       25 |    36.21 |... 39,141,147,155 |
------------------------------|----------|----------|----------|----------|-------------------|
pre-commit finished
