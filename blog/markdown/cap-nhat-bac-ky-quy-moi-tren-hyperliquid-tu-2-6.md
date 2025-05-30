---
title: "Cập Nhật Bậc Ký Quỹ Mới trên Hyperliquid từ 2/6!"
date: 2025-05-30
author: "Team HyperVN"
category: news
readTime: 6
excerpt: "Hyperliquid giới thiệu hệ thống bậc ký quỹ mới từ 2/6, tương tự các sàn giao dịch tập trung! Tối ưu hóa đòn bẩy và quản lý rủi ro hiệu quả hơn. Tìm hiểu chi tiết ngay! #Hyperliquid #DeFi #Trading #KýQuỹ"
image: <img src="/blog/images/starting-from-june-2nd-margin-tiers-like-most-cent.webp" alt="Illustration representing starting from june 2nd Margin tiers Like most centralized exchanges, the tiered leverage formula on Hyperliquid is as follows: maintenance_margin = notional_position_value * maintenance_margin_rate - maintenance_deduction On Hyperliquid, maintenance_margin_rate and maintenance_deduction depend only on the margin tiers, not the asset. maintenance_margin_rate(tier = n) = (Initial Margin Rate at Maximum leverage at tier n) / 2 . For example, at 20x max leverage, maintenance_margin_rate = 2.5%. Maintenance deduction is defined at each tier to account for the different maintenance margin rates used at previous tiers: maintenance_deduction(tier = 0) = 0 maintenance_deduction(tier = n) = maintenance_deduction(tier = n - 1) + notional_position_lower_bound(tier = n) * (maintenance_margin_rate(tier = n) - maintenance_margin_rate(tier = n - 1)) for n > 0 In other words, maintenance deduction is defined so that new positions opened at each tier increase maintenance margin at maintenance_margin_rate , while having the total maintenance margin be a continuous function of position size. Margin tables have unique IDs and the tiers can be found in the meta Info response. Mainnet Margin Tiers Mainnet margin tiers are enabled for the assets below except BTC, ETH, SOL, XRP, HYPE, and FARTCOIN which will be enabled on a later update. BTC Notional Position Value (USDC) Max Leverage 0-150M 40 >150M 20 ETH Notional Position Value (USDC) Max Leverage 0-100M 25 >100M 15 SOL Notional Position Value (USDC) Max Leverage 0-70M 20 >70M 10 XRP Notional Position Value (USDC) Max Leverage 0-40M 20 >40M 10 DOGE, kPEPE, SUI, WLD, TRUMP, LTC, ENA, POPCAT, WIF, AAVE, kBONK, LINK, CRV, AVAX, ADA, UNI, NEAR, TIA, APT, BCH, HYPE, FARTCOIN Notional Position Value (USDC) Max Leverage 0-20M 10 >20M 5 OP, ARB, LDO, TON, MKR, ONDO, JUP, INJ, kSHIB, SEI, TRX, BNB, DOT Notional Position Value (USDC) Max Leverage 0-3M 10 >3M 5 Testnet Margin Tiers The tiers on testnet are lower than mainnet would feature, for ease of testing. LDO, ARB, MKR, ATOM, PAXG, TAO, ICP, AVAX, FARTCOIN - testnet only Notional Position Value (USDC) Max Leverage 0-10k 10 >10k 5 DOGE, TIA, SUI, kSHIB, AAVE, TON - testnet only Notional Position Value (USDC) Max Leverage 0-20k 10 20-100k 5 >100k 3 ETH - testnet only Notional Position Value (USDC) Max Leverage 0-20k 25 20-50k 10 50-200k 5 >200k 3 BTC - testnet only Notional Position Value (USDC) Max Leverage 0-10k 40 10-50k 25 50-100k 10 100k-300k 5 >300k 3 for Hyperliquid blog post" style="width:100%;height:auto;">
featured: false
---

Xin chào cộng đồng Hyperliquid Việt Nam!


<figure style='text-align: center;'>
  <img src='/blog/images/starting-from-june-2nd-margin-tiers-like-most-cent.webp' alt='Illustration representing starting from june 2nd Margin tiers Like most centralized exchanges, the tiered leverage formula on Hyperliquid is as follows: maintenance_margin = notional_position_value * maintenance_margin_rate - maintenance_deduction On Hyperliquid, maintenance_margin_rate and maintenance_deduction depend only on the margin tiers, not the asset. maintenance_margin_rate(tier = n) = (Initial Margin Rate at Maximum leverage at tier n) / 2 . For example, at 20x max leverage, maintenance_margin_rate = 2.5%. Maintenance deduction is defined at each tier to account for the different maintenance margin rates used at previous tiers: maintenance_deduction(tier = 0) = 0 maintenance_deduction(tier = n) = maintenance_deduction(tier = n - 1) + notional_position_lower_bound(tier = n) * (maintenance_margin_rate(tier = n) - maintenance_margin_rate(tier = n - 1)) for n > 0 In other words, maintenance deduction is defined so that new positions opened at each tier increase maintenance margin at maintenance_margin_rate , while having the total maintenance margin be a continuous function of position size. Margin tables have unique IDs and the tiers can be found in the meta Info response. Mainnet Margin Tiers Mainnet margin tiers are enabled for the assets below except BTC, ETH, SOL, XRP, HYPE, and FARTCOIN which will be enabled on a later update. BTC Notional Position Value (USDC) Max Leverage 0-150M 40 >150M 20 ETH Notional Position Value (USDC) Max Leverage 0-100M 25 >100M 15 SOL Notional Position Value (USDC) Max Leverage 0-70M 20 >70M 10 XRP Notional Position Value (USDC) Max Leverage 0-40M 20 >40M 10 DOGE, kPEPE, SUI, WLD, TRUMP, LTC, ENA, POPCAT, WIF, AAVE, kBONK, LINK, CRV, AVAX, ADA, UNI, NEAR, TIA, APT, BCH, HYPE, FARTCOIN Notional Position Value (USDC) Max Leverage 0-20M 10 >20M 5 OP, ARB, LDO, TON, MKR, ONDO, JUP, INJ, kSHIB, SEI, TRX, BNB, DOT Notional Position Value (USDC) Max Leverage 0-3M 10 >3M 5 Testnet Margin Tiers The tiers on testnet are lower than mainnet would feature, for ease of testing. LDO, ARB, MKR, ATOM, PAXG, TAO, ICP, AVAX, FARTCOIN - testnet only Notional Position Value (USDC) Max Leverage 0-10k 10 >10k 5 DOGE, TIA, SUI, kSHIB, AAVE, TON - testnet only Notional Position Value (USDC) Max Leverage 0-20k 10 20-100k 5 >100k 3 ETH - testnet only Notional Position Value (USDC) Max Leverage 0-20k 25 20-50k 10 50-200k 5 >200k 3 BTC - testnet only Notional Position Value (USDC) Max Leverage 0-10k 40 10-50k 25 50-100k 10 100k-300k 5 >300k 3 for Hyperliquid blog post' style='width:100%;max-width:600px;margin:0 auto;display:block;'>
  <figcaption style='font-size: 0.9em; color: #555; margin-top: 5px;'>Illustration representing starting from june 2nd Margin tiers Like most centralized exchanges, the tiered leverage formula on Hyperliquid is as follows: maintenance_margin = notional_position_value * maintenance_margin_rate - maintenance_deduction On Hyperliquid, maintenance_margin_rate and maintenance_deduction depend only on the margin tiers, not the asset. maintenance_margin_rate(tier = n) = (Initial Margin Rate at Maximum leverage at tier n) / 2 . For example, at 20x max leverage, maintenance_margin_rate = 2.5%. Maintenance deduction is defined at each tier to account for the different maintenance margin rates used at previous tiers: maintenance_deduction(tier = 0) = 0 maintenance_deduction(tier = n) = maintenance_deduction(tier = n - 1) + notional_position_lower_bound(tier = n) * (maintenance_margin_rate(tier = n) - maintenance_margin_rate(tier = n - 1)) for n > 0 In other words, maintenance deduction is defined so that new positions opened at each tier increase maintenance margin at maintenance_margin_rate , while having the total maintenance margin be a continuous function of position size. Margin tables have unique IDs and the tiers can be found in the meta Info response. Mainnet Margin Tiers Mainnet margin tiers are enabled for the assets below except BTC, ETH, SOL, XRP, HYPE, and FARTCOIN which will be enabled on a later update. BTC Notional Position Value (USDC) Max Leverage 0-150M 40 >150M 20 ETH Notional Position Value (USDC) Max Leverage 0-100M 25 >100M 15 SOL Notional Position Value (USDC) Max Leverage 0-70M 20 >70M 10 XRP Notional Position Value (USDC) Max Leverage 0-40M 20 >40M 10 DOGE, kPEPE, SUI, WLD, TRUMP, LTC, ENA, POPCAT, WIF, AAVE, kBONK, LINK, CRV, AVAX, ADA, UNI, NEAR, TIA, APT, BCH, HYPE, FARTCOIN Notional Position Value (USDC) Max Leverage 0-20M 10 >20M 5 OP, ARB, LDO, TON, MKR, ONDO, JUP, INJ, kSHIB, SEI, TRX, BNB, DOT Notional Position Value (USDC) Max Leverage 0-3M 10 >3M 5 Testnet Margin Tiers The tiers on testnet are lower than mainnet would feature, for ease of testing. LDO, ARB, MKR, ATOM, PAXG, TAO, ICP, AVAX, FARTCOIN - testnet only Notional Position Value (USDC) Max Leverage 0-10k 10 >10k 5 DOGE, TIA, SUI, kSHIB, AAVE, TON - testnet only Notional Position Value (USDC) Max Leverage 0-20k 10 20-100k 5 >100k 3 ETH - testnet only Notional Position Value (USDC) Max Leverage 0-20k 25 20-50k 10 50-200k 5 >200k 3 BTC - testnet only Notional Position Value (USDC) Max Leverage 0-10k 40 10-50k 25 50-100k 10 100k-300k 5 >300k 3 for Hyperliquid blog post</figcaption>
</figure>


Chúng tôi vui mừng thông báo về việc triển khai hệ thống bậc ký quỹ (margin tiers) mới trên Hyperliquid, bắt đầu từ ngày 2 tháng 6. Thay đổi này sẽ mang đến trải nghiệm giao dịch linh hoạt và hiệu quả hơn, tương tự như các sàn giao dịch tập trung (CEX) truyền thống.

## Bậc Ký Quỹ Là Gì?

Bậc ký quỹ là một hệ thống phân loại, cho phép người dùng sử dụng đòn bẩy khác nhau dựa trên giá trị vị thế của họ. Về cơ bản, khi giá trị vị thế của bạn tăng lên, đòn bẩy tối đa mà bạn có thể sử dụng sẽ giảm xuống, giúp giảm thiểu rủi ro và đảm bảo tính thanh khoản cho nền tảng.


<figure style='text-align: center;'>
  <img src='/blog/images/additional-image-1-a-graphic-illustrating-how-max.webp' alt='A graphic illustrating how maximum leverage decreases as notional position value increases.' style='width:100%;max-width:600px;margin:0 auto;display:block;'>
  <figcaption style='font-size: 0.9em; color: #555; margin-top: 5px;'>A graphic illustrating how maximum leverage decreases as notional position value increases.</figcaption>
</figure>


## Công Thức Tính Toán Ký Quỹ Duy Trì

Tương tự như hầu hết các sàn giao dịch tập trung, công thức tính toán ký quỹ duy trì (maintenance margin) trên Hyperliquid như sau:

`maintenance_margin = notional_position_value * maintenance_margin_rate - maintenance_deduction`

Trong đó:

*   `notional_position_value`: Giá trị vị thế danh nghĩa (tính bằng USDC).
*   `maintenance_margin_rate`: Tỷ lệ ký quỹ duy trì.
*   `maintenance_deduction`: Khoản khấu trừ ký quỹ duy trì.

Trên Hyperliquid, `maintenance_margin_rate` và `maintenance_deduction` chỉ phụ thuộc vào bậc ký quỹ, chứ không phụ thuộc vào loại tài sản.

*   `maintenance_margin_rate(tier = n) = (Initial Margin Rate at Maximum leverage at tier n) / 2`. Ví dụ: ở mức đòn bẩy tối đa 20x, `maintenance_margin_rate = 2.5%`.

*   Khoản khấu trừ ký quỹ duy trì được xác định ở mỗi bậc để tính đến các tỷ lệ ký quỹ duy trì khác nhau được sử dụng ở các bậc trước đó:

    *   `maintenance_deduction(tier = 0) = 0`
    *   `maintenance_deduction(tier = n) = maintenance_deduction(tier = n - 1) + notional_position_lower_bound(tier = n) * (maintenance_margin_rate(tier = n) - maintenance_margin_rate(tier = n - 1))` cho n > 0

Nói cách khác, khoản khấu trừ ký quỹ duy trì được xác định sao cho các vị thế mới được mở ở mỗi bậc làm tăng ký quỹ duy trì ở `maintenance_margin_rate`, đồng thời đảm bảo tổng ký quỹ duy trì là một hàm liên tục của quy mô vị thế.

## Bậc Ký Quỹ trên Mainnet

Các bậc ký quỹ trên Mainnet đã được kích hoạt cho các tài sản được liệt kê bên dưới, ngoại trừ BTC, ETH, SOL, XRP, HYPE và FARTCOIN, sẽ được kích hoạt trong một bản cập nhật sau.

### BTC

| Giá trị Vị Thế Danh Nghĩa (USDC) | Đòn Bẩy Tối Đa |
| ---------------------------------- | ------------- |
| 0-150M                             | 40            |
| \>150M                             | 20            |

### ETH

| Giá trị Vị Thế Danh Nghĩa (USDC) | Đòn Bẩy Tối Đa |
| ---------------------------------- | ------------- |
| 0-100M                             | 25            |
| \>100M                             | 15            |

### SOL

| Giá trị Vị Thế Danh Nghĩa (USDC) | Đòn Bẩy Tối Đa |
| ---------------------------------- | ------------- |
| 0-70M                              | 20            |
| \>70M                              | 10            |

### XRP

| Giá trị Vị Thế Danh Nghĩa (USDC) | Đòn Bẩy Tối Đa |
| ---------------------------------- | ------------- |
| 0-40M                              | 20            |
| \>40M                              | 10            |

### DOGE, kPEPE, SUI, WLD, TRUMP, LTC, ENA, POPCAT, WIF, AAVE, kBONK, LINK, CRV, AVAX, ADA, UNI, NEAR, TIA, APT, BCH, HYPE, FARTCOIN

| Giá trị Vị Thế Danh Nghĩa (USDC) | Đòn Bẩy Tối Đa |
| ---------------------------------- | ------------- |
| 0-20M                              | 10            |
| \>20M                              | 5             |

### OP, ARB, LDO, TON, MKR, ONDO, JUP, INJ, kSHIB, SEI, TRX, BNB, DOT

| Giá trị Vị Thế Danh Nghĩa (USDC) | Đòn Bẩy Tối Đa |
| ---------------------------------- | ------------- |
| 0-3M                               | 10            |
| \>3M                               | 5             |

## Bậc Ký Quỹ trên Testnet

Các bậc ký quỹ trên testnet thấp hơn so với mainnet để dễ dàng thử nghiệm.

### LDO, ARB, MKR, ATOM, PAXG, TAO, ICP, AVAX, FARTCOIN - chỉ dành cho testnet

| Giá trị Vị Thế Danh Nghĩa (USDC) | Đòn Bẩy Tối Đa |
| ---------------------------------- | ------------- |
| 0-10k                              | 10            |
| \>10k                              | 5             |

### DOGE, TIA, SUI, kSHIB, AAVE, TON - chỉ dành cho testnet

| Giá trị Vị Thế Danh Nghĩa (USDC) | Đòn Bẩy Tối Đa |
| ---------------------------------- | ------------- |
| 0-20k                              | 10            |
| 20-100k                            | 5             |
| \>100k                             | 3             |

### ETH - chỉ dành cho testnet

| Giá trị Vị Thế Danh Nghĩa (USDC) | Đòn Bẩy Tối Đa |
| ---------------------------------- | ------------- |
| 0-20k                              | 25            |
| 20-50k                             | 10            |
| 50-200k                            | 5             |
| \>200k                             | 3             |

### BTC - chỉ dành cho testnet

| Giá trị Vị Thế Danh Nghĩa (USDC) | Đòn Bẩy Tối Đa |
| ---------------------------------- | ------------- |
| 0-10k                              | 40            |
| 10-50k                             | 25            |
| 50-100k                            | 10            |
| 100k-300k                          | 5             |
| \>300k                             | 3             |

## Lợi Ích Của Bậc Ký Quỹ

*   **Quản lý rủi ro tốt hơn:** Giảm đòn bẩy khi quy mô vị thế tăng lên giúp giảm thiểu rủi ro thanh lý.
*   **Tối ưu hóa vốn:** Cho phép người dùng sử dụng đòn bẩy cao hơn cho các vị thế nhỏ hơn, tối ưu hóa việc sử dụng vốn.
*   **Tính thanh khoản:** Giúp duy trì tính thanh khoản của nền tảng bằng cách giảm thiểu rủi ro cho các vị thế lớn.
*   **Linh hoạt:** Cung cấp sự linh hoạt hơn trong việc lựa chọn đòn bẩy phù hợp với khẩu vị rủi ro của từng người dùng.


<figure style='text-align: center;'>
  <img src='/blog/images/additional-image-2-a-simple-chart-highlighting-th.webp' alt='A simple chart highlighting the benefits of margin tiers.' style='width:100%;max-width:600px;margin:0 auto;display:block;'>
  <figcaption style='font-size: 0.9em; color: #555; margin-top: 5px;'>A simple chart highlighting the benefits of margin tiers.</figcaption>
</figure>


## Cách Xem Bậc Ký Quỹ

Bạn có thể tìm thấy các bậc ký quỹ trong phản hồi meta Info. Margin tables có ID riêng.

## Kết Luận

Việc triển khai hệ thống bậc ký quỹ là một bước tiến quan trọng trong việc nâng cao trải nghiệm giao dịch trên Hyperliquid. Chúng tôi tin rằng tính năng này sẽ giúp người dùng quản lý rủi ro hiệu quả hơn, tối ưu hóa vốn và tận hưởng giao dịch phái sinh phi tập trung một cách an toàn và linh hoạt.

Hãy theo dõi các thông báo tiếp theo của chúng tôi để biết thêm thông tin chi tiết về các bản cập nhật và tính năng mới trên Hyperliquid. Chúc các bạn giao dịch thành công!

Nếu bạn có bất kỳ câu hỏi nào, vui lòng tham gia cộng đồng Hyperliquid Việt Nam trên Telegram hoặc Discord để được hỗ trợ.

[link text](https://example.com) - Link to Hyperliquid's official announcement (replace with the actual link)

[link text](https://example.com) - Link to Hyperliquid's documentation on margin tiers (replace with the actual link)