import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";

export interface FormulirSanggahanData {
  namaProyek: string;
  nomorPeng: string;
  prefill?: {
    nama?: string;
    nik?: string;
    alasHak?: string;
    noDanom?: string;
    noPetaBidang?: string;
    noNis?: string;
    isiSanggahan?: string;
    nomorTiket?: string;
  };
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#18181b",
  },
  title: {
    fontSize: 13,
    fontWeight: 700,
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#18181b",
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: 140,
  },
  colon: {
    width: 10,
  },
  value: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#71717a",
    minHeight: 14,
    paddingBottom: 2,
  },
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
    lineHeight: 1.6,
    textAlign: "justify",
  },
  isiBox: {
    borderWidth: 1,
    borderColor: "#71717a",
    minHeight: 140,
    padding: 8,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#18181b",
  },
  signatureBlock: {
    marginTop: 30,
    alignSelf: "flex-end",
    width: 220,
    textAlign: "center",
  },
  signatureSpace: {
    height: 60,
  },
  footerNote: {
    marginTop: 30,
    fontSize: 8,
    color: "#71717a",
  },
});

function FieldRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={styles.value}>{value ?? ""}</Text>
    </View>
  );
}

export function FormulirSanggahanDocument({ namaProyek, nomorPeng, prefill }: FormulirSanggahanData) {
  return (
    <Document
      title="Formulir Sanggahan Data Nominatif"
      author="Panitia Pengadaan Tanah Kota Depok"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Formulir Sanggahan Data Nominatif</Text>
        <Text style={styles.subtitle}>{namaProyek}</Text>
        <Text style={styles.subtitle}>Nomor Pengumuman: {nomorPeng}</Text>
        {prefill?.nomorTiket && (
          <Text style={styles.subtitle}>Nomor Tiket: {prefill.nomorTiket}</Text>
        )}

        <View style={styles.divider} />

        <FieldRow label="Nama" value={prefill?.nama} />
        <FieldRow label="NIK" value={prefill?.nik} />
        <FieldRow label="Alas Hak" value={prefill?.alasHak} />
        <FieldRow label="No. Danom" value={prefill?.noDanom} />
        <FieldRow label="No. Peta Bidang" value={prefill?.noPetaBidang} />
        <FieldRow label="No. NIS" value={prefill?.noNis} />

        <Text style={styles.paragraph}>
          Dengan ini saya mengajukan sanggahan terhadap data nominatif yang telah diumumkan
          sehubungan dengan kegiatan pengadaan tanah untuk kepentingan umum tersebut di atas,
          dengan alasan/keterangan sebagai berikut:
        </Text>

        <View style={styles.isiBox}>
          <Text>{prefill?.isiSanggahan ?? ""}</Text>
        </View>

        <Text style={styles.paragraph}>
          Demikian sanggahan ini saya sampaikan dengan sebenar-benarnya. Apabila di kemudian
          hari terbukti data/keterangan yang saya sampaikan tidak benar, saya bersedia
          bertanggung jawab sepenuhnya sesuai ketentuan peraturan perundang-undangan yang
          berlaku.
        </Text>

        <View style={styles.checkboxRow}>
          <View style={styles.checkbox} />
          <Text>Saya menyatakan bahwa data yang saya isikan di atas adalah benar.</Text>
        </View>

        <View style={styles.signatureBlock}>
          <Text>Depok, ......................................</Text>
          <Text>Yang Mengajukan Sanggahan,</Text>
          <View style={styles.signatureSpace} />
          <Text>({prefill?.nama ?? "..............................."})</Text>
        </View>

        <Text style={styles.footerNote}>
          Formulir ini dapat diisi manual dan diserahkan langsung, atau diajukan secara online
          melalui halaman Ajukan Sanggahan pada website resmi pengadaan tanah.
        </Text>
      </Page>
    </Document>
  );
}

export async function renderFormulirSanggahanPdf(data: FormulirSanggahanData): Promise<Buffer> {
  return renderToBuffer(<FormulirSanggahanDocument {...data} />);
}
