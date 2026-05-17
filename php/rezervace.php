<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../index.html');
    exit;
}

// chytani dat z formulare a smazani mezer okolo textu
// dva otazniky daji prazdny text pokud policko uplne chybi
$datum    = trim($_POST['datum']    ?? '');
$cas      = trim($_POST['cas']      ?? '');
$pocet    = trim($_POST['pocet']    ?? '');
$typ      = trim($_POST['typ']      ?? '');
$jmeno    = trim($_POST['jmeno']    ?? '');
$email    = trim($_POST['email']    ?? '');
$telefon  = trim($_POST['telefon']  ?? '');
$poznamka = trim($_POST['poznamka'] ?? '');

$chyby = [];

if (empty($datum))                               $chyby[] = 'Datum je povinné.';
if (empty($cas))                                $chyby[] = 'Čas je povinný.';
if ($pocet < 1 || $pocet > 30)                  $chyby[] = 'Počet osob musí být 1–30.';
if (empty($typ))                                $chyby[] = 'Vyberte typ vstupenky.';
if (empty($jmeno))                              $chyby[] = 'Zadejte jméno.';
// kontrola jestli ma email spravny tvar s zavinacem a teckou
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $chyby[] = 'Zadejte platný e-mail.';

$uspech = false;

if (empty($chyby)) {
    // dir je zkratka pro aktualni slozku kde lezi tento skript
    $csvSoubor = __DIR__ . '/../data/rezervace.csv';

    // pokud soubor jeste neexistuje vyrobi se prvni radek s nazvy sloupcu
    if (!file_exists($csvSoubor)) {
        file_put_contents($csvSoubor, "datum_vytvoreni,datum_navstevy,cas,pocet_osob,typ_vstupenky,jmeno,email,telefon,poznamka\n");
    }

    // otevre soubor pro pridani na konec takze se nesmazou starz rezervace
    $fp = fopen($csvSoubor, 'a');
    if ($fp) {
        // posklada data do jednoho radku oddeleneho carkami pro excel
        fputcsv($fp, [date('Y-m-d H:i:s'), $datum, $cas, $pocet, $typ, $jmeno, $email, $telefon, $poznamka]);
        fclose($fp); // zavre soubor aby nezustal viset v pameti
        $uspech = true;
    } else {
        $chyby[] = 'Nelze uložit rezervaci.';
    }
}
?>
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <title>Rezervace | Muzeum Módy</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body class="rezervace-body">

    <div class="rezervace-box">

        <?php if ($uspech) { ?>

            <h1>Rezervace přijata</h1>
            <!-- cisti text aby nikdo nemohl do formulare propasovat spatznej kod -->
            <p>Děkujeme, <strong><?= htmlspecialchars($jmeno) ?></strong>! Vaše rezervace byla uložena.</p>
            <p><?= htmlspecialchars($datum) ?> v <?= htmlspecialchars($cas) ?> · <?= htmlspecialchars($pocet) ?> os. · <?= htmlspecialchars($typ) ?></p>

        <?php } else { ?>

            <h1>Něco chybí</h1>
            <ul class="rezervace-chyby">
                <?php foreach ($chyby as $c) { ?>
                    <li><?= htmlspecialchars($c) ?></li>
                <?php } ?>
            </ul>

        <?php } ?>

        <a href="../index.html#reservation" class="rezervace-zpet">← Zpět na rezervaci</a>

    </div>

</body>
</html>
