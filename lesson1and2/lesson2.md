## 导出编译器 MOC 路径

export PATH=$(dfx cache show):$PATH

## 运行 moc 调试

moc --package base $(dfx cache show)/base -r src/icp_showcase/quickSortTest.mo
## 主网 Candid UI 调试运行
https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app