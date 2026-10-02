# Config file for latexmk to force lualatex even if -xelatex argument is passed by editor
$pdf_mode = 4;
$postscript_mode = $dvi_mode = 0;
$lualatex = 'lualatex -synctex=1 -interaction=nonstopmode -file-line-error %O %S';
$xelatex  = 'lualatex -synctex=1 -interaction=nonstopmode -file-line-error %O %S';
