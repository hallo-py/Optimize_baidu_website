const params = new URLSearchParams(window.location.search);

if (params.has('tn')) {
    params.delete('tn');
    window.location.href = `${window.location.origin}${window.location.pathname}?${params.toString()}#`
}